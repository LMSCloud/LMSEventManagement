(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.EventManagementBundle = factory());
})(this, (function () { 'use strict';

  const template = document.createElement('template');
  // eslint-disable-next-line no-undef
  template.innerHTML = `
  <div class="lms-event card" style="max-width: 18rem;">
    <slot name="event-id">
      <slot name="event-image"></slot>
    </slot>
    <div class="card-body">
      <slot name="event-name"></slot>
      <p class="card-text">
        <slot name="start-time"></slot>
      </p>
    </div>
  </div>
`;

  class LmseEventCard extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.append(template.content.cloneNode(true));
    }
  }

  class Observable {
    constructor() {
      this.observers = [];
    }

    subscribe(func) {
      this.observers.push(func);
    }

    unsubscribe(func) {
      this.observers = this.observers.filter((observer) => observer !== func);
    }

    notify(data) {
      this.observers.forEach((observer) => observer(data));
    }
  }

  var Observable$1 = new Observable();

  class LmseEventsFilter {
    constructor(facets) {
      this.facets = facets;
      this.filters = {};
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
            Observable$1.notify(this.getFilters());
          });
        }

        if (facet.type === 'date') {
          this.filters[facet.name] = facet.value;

          facet.addEventListener('change', (e) => {
            this.filters[e.target.name] = e.target.value;
            Observable$1.notify(this.getFilters());
          });
        }

        if (facet.type === 'range') {
          this.filters[facet.name] = parseInt(facet.value, 10);

          facet.addEventListener('change', (e) => {
            this.filters[e.target.name] = parseInt(e.target.value, 10);
            Observable$1.notify(this.getFilters());
          });
        }
      });
    }

    getFilters() {
      return this.filters;
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
      this.lmseEventsFilter = new LmseEventsFilter(this.facets);
      this.Observable = Observable$1;
    }

    init() {
      this.lmseEventsFilter.init();
      this.Observable.subscribe(this.updateView);
    }

    async updateView(filters) {
      const events = await LmseEventsView.getEvents(filters);
      console.log(events);
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

  const customElementRegistry = window.customElements;
  customElementRegistry.define('lmse-event', LmseEventCard);

  var main = {
    LmseEventsView, uploadImage, updateRangeOutput,
  };

  return main;

}));
