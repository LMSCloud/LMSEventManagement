(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.EventManagementBundle = factory());
})(this, (function () { 'use strict';

  class LmseEventsFilter {
    constructor(facets, Observable) {
      this.facets = facets;
      this.filters = {};
      this.Observable = Observable;
    }

    init() {
      this.facets.forEach((facet) => {
        // Have to change this to an object with arrays as property values instead of a nested object
        if (facet.type === 'checkbox') {
          if (!Object.prototype.hasOwnProperty.call(this.filters, facet.name)) {
            this.filters[facet.name] = {};
          }

          this.filters[facet.name][facet.value] = facet.checked;

          facet.addEventListener('change', (e) => {
            this.filters[e.target.name][e.target.value] = e.target.checked;
            this.Observable.notify(this.getFilters());
          });
        }

        if (facet.type === 'date') {
          this.filters[facet.name] = facet.value;

          facet.addEventListener('change', (e) => {
            this.filters[e.target.name] = e.target.value;
            this.Observable.notify(this.getFilters());
          });
        }

        if (facet.type === 'range') {
          this.filters[facet.name] = parseInt(facet.value, 10);

          facet.addEventListener('change', (e) => {
            this.filters[e.target.name] = parseInt(e.target.value, 10);
            this.Observable.notify(this.getFilters());
          });
        }
      });
    }

    resetFacets() {
      this.facets.forEach((facet) => {
        const facetRef = facet;

        if (facetRef.type === 'checkbox') {
          facetRef.checked = false;
          if (!Object.prototype.hasOwnProperty.call(this.filters, facet.name)) {
            this.filters[facet.name] = {};
          }

          this.filters[facet.name][facet.value] = facet.checked;
        }

        if (facetRef.type === 'date') {
          facetRef.value = '';
          this.filters[facet.name] = facet.value;
        }

        if (facetRef.type === 'range') {
          facetRef.value = 120;
          this.filters[facet.name] = parseInt(facet.value, 10);
        }
      });

      this.Observable.notify(this.getFilters());
    }

    getFilters() {
      return this.filters;
    }
  }

  function transformTimestamp(timestamp) {
    // TODO: Extract handlers for different locales to a class which is instantiated once
    const [date, time] = timestamp.split(' ');
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');

    if (window.navigator.language === 'de-DE') {
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    if (window.navigator.language === 'en-US') {
      return `${month}/${day}/${year} ${parseInt(hours, 10) > 12 ? hours - 12 : hours}:${minutes} ${hours > 12 ? 'p.m.' : 'a.m.'}`;
    }

    if (window.navigator.language === 'en-GB') {
      return `${day}/${month}/${year} ${parseInt(hours, 10) > 12 ? hours - 12 : hours}.${minutes} ${hours > 12 ? 'p.m.' : 'a.m.'}`;
    }

    return timestamp;
  }

  function lmseEventCard({ lmseEvent }) {
    const element = document.createElement('div');
    element.classList.add('lms-event', 'lmse-card');
    element.innerHTML = `
    <div class="lmse-card-head">
      ${lmseEvent.open_registration ? '<div class="lmse-indicator"><i class="fa fa-unlock-alt" aria-hidden="true"></i></div>' : ''}
      <a href="/opac-events?op=detail&id=${lmseEvent.id}">
        <img src="/lms-event-management/images/${lmseEvent.image}"
          alt="..."
          height="210"
        >
      </a>
    </div>
    <div class="lmse-card-body">
      <h5>${lmseEvent.name}</h5>
      <ul>
        <li>
          <i class="fa fa-calendar" aria-hidden="true"></i>
          <time datetime="${lmseEvent.start_time}">${transformTimestamp(lmseEvent.start_time)}</time>
        </li>
        <li>
          <i class="fa fa-money" aria-hidden="true"></i>
          <span>${lmseEvent.fee}</span>
        </li>
      </ul>
    </div>
  `;

    return element;
  }

  class Observable {
    constructor(caller) {
      this.observers = [];
      this.caller = caller;
    }

    subscribe(func) {
      this.observers.push(func);
    }

    unsubscribe(func) {
      this.observers = this.observers.filter((observer) => observer !== func);
    }

    notify(data) {
      this.observers.forEach((observer) => {
        const boundObserver = observer.bind(this.caller);
        boundObserver(data);
      });
    }
  }

  const fieldLookupTable = {
    target_group: 'target_groups',
    event_type: 'event_types',
    branch: 'branches',
    location: 'locations',
  };

  function getRequestParameters(filters) {
    return Array.from(Object.entries(filters))
      .reduce((accumulator, filter) => {
        const [field, values] = filter;

        if (['max_age', 'start_time', 'end_time'].includes(field)) { return values ? [...accumulator, `${field}=${values}`] : accumulator; }

        if (field === 'open_registration') { return values.open_registration ? [...accumulator, `${field}=${true}`] : accumulator; }

        const valuesArray = Array.from(Object.entries(values));
        const isMultiParam = valuesArray.filter(([, value]) => value === true).length > 1;
        return [
          ...accumulator,
          valuesArray.reduce((_accumulator, value) => {
            const [name, isActive] = value;
            return isActive ? [..._accumulator, `${isMultiParam ? fieldLookupTable[field] : field}=${name}`] : [..._accumulator];
          }, []),
        ].flat();
      }, [])
      .join('&');
  }

  class LmseEventsView {
    constructor({ entryPoint, facets }) {
      this.entryPoint = entryPoint;
      this.facets = facets;
      this.Observable = new Observable(this);
      this.lmseEventsFilter = new LmseEventsFilter(this.facets, this.Observable);
    }

    init() {
      this.lmseEventsFilter.init();
      this.Observable.subscribe(this.updateView);
      this.updateView({});
    }

    async updateView(filters) {
      const lmseEvents = await LmseEventsView.getEvents(filters);
      this.entryPoint.innerHTML = '';

      const eventCards = lmseEvents.reduce(
        (accumulator, lmseEvent) => [
          ...accumulator, lmseEventCard({ lmseEvent }),
        ],
        [],
      );

      eventCards.forEach((eventCard) => {
        this.entryPoint.appendChild(eventCard);
      });
    }

    resetEventsFilter() {
      this.lmseEventsFilter.resetFacets();
    }

    static async getEvents(filters) {
      const requestParameters = getRequestParameters(filters);
      const response = await fetch(`/api/v1/contrib/eventmanagement/lms_events${requestParameters ? '?' : ''}${requestParameters}`);

      return response.json();
    }
  }

  async function uploadImage(e, { uploadedFileIdInput, fileUploadHint }) {
    const uploadedFileIdInputRef = uploadedFileIdInput;
    const fileUploadHintRef = fileUploadHint;

    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    const response = await fetch('/cgi-bin/koha/tools/upload-file.pl?category=LMSEventManagement&public=1&temp=0', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.status === 'done') {
      uploadedFileIdInputRef.value = result.fileid;

      fileUploadHintRef.innerHTML = `
          <i class="fa fa-check" aria-hidden="true">
          </i><span>&nbsp;Upload succeeded</span>
      `;

      return;
    }

    if (result.status === 'failed') {
      /** We briefly check whether we've got an already existing file ('UPLERR_ALREADY_EXISTS')
         *   and assign that id to the image form field to preserve the existing state of the event.
         */
      const errors = result.errors
        ? Object.entries(result.errors).reduce(
          (accumulator, [fileName, { code }]) => `${accumulator}${accumulator ? '\n' : ''}${fileName}: ${code}`,
          '',
        )
        : 'Upload aborted';

      if (errors.includes('UPLERR_ALREADY_EXISTS')) {
        // TODO: Implement handling of already existing images
        uploadedFileIdInputRef.value = '';
      }

      fileUploadHintRef.innerHTML = `
          <i class="fa fa-exclamation" aria-hidden="true"></i>
          <span>&nbsp;Upload had errors: ${errors}</span>
      `;
    }
  }

  function updateRangeOutput({ rangeInput, rangeOutput }) {
    const rangeOutputRef = rangeOutput;
    rangeOutputRef.textContent = rangeInput.value === '120' ? '∞' : rangeInput.value;
  }

  var main = {
    LmseEventsView, uploadImage, updateRangeOutput,
  };

  return main;

}));
