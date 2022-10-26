(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.EventManagementBundle = factory());
})(this, (function () { 'use strict';

  class LMSEvent {
    constructor({ element }) {
      this.elementRef = element;
      const {
        targetGroup, eventType, branch, maxAge, openRegistration, startTime, endTime, filteredBy,
      } = element.dataset;
      this.targetGroup = targetGroup;
      this.eventType = eventType;
      this.branch = branch;
      this.maxAge = maxAge;
      this.openRegistration = openRegistration;
      this.startTime = startTime;
      this.endTime = endTime;
      this.filteredBy = filteredBy;
      this.state = 'visible';
      this.filters = [];
    }

    show() {
      this.elementRef.classList.remove('d-none');
      this.state = 'visible';
    }

    hide() {
      this.elementRef.classList.add('d-none');
      this.state = 'hidden';
    }

    isVisible() {
      return this.state === 'visible';
    }

    getFilters() {
      return this.filters;
    }

    getValuesOfActiveFilters() {
      return this.filters.map((filter) => ({ name: filter, value: this[filter] }));
    }

    addFilter(filter) {
      this.filters.push(filter);
    }

    removeFilter(filter) {
      this.filters.filter((_filter) => _filter !== filter);
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

  /**
   * The events property expects an array of references to cards with an lms-event class.
   * The facets property expects an array of references to input elements with an lms-facet class.
   */

  class LMSEvents {
    constructor({ events, facets }) {
      this.events = events;
      this.facets = facets;
      this.lmsEventsArray = [];
      this.checkboxFacets = [];
    }

    init() {
      this.events.forEach((element) => {
        this.lmsEventsArray.push(new LMSEvent({ element }));
      });

      const facets = Array.from(this.facets);

      this.checkboxFacets = facets.filter((facet) => facet.type === 'checkbox');

      this.checkboxFacets.forEach((facet) => {
        facet.addEventListener('change', (e) => this.handleCheckboxes(e));
      });

      this.rangeFacets = facets.filter((facet) => facet.type === 'range');

      this.rangeFacets.forEach((facet) => {
        facet.addEventListener('change', (e) => this.handleAgeRange(e));
      });
    }

    getSelectedEvents({ name, value }) {
      return this.lmsEventsArray.filter((lmsEvent) => lmsEvent[name] === value);
    }

    getNonSelectedEvents({ name, value }) {
      return this.lmsEventsArray.filter((lmsEvent) => lmsEvent[name] !== value);
    }

    handleCheckboxes(e) {
      const { name, checked, value } = e.target;

      if (checked) {
        this.getNonSelectedEvents({ name, value }).forEach((lmsEvent) => {
          lmsEvent.addFilter(name);
        });
        this.updateView();
        return;
      }

      if (!checked) {
        this.getSelectedEvents({ name, value }).forEach((lmsEvent) => {
          lmsEvent.removeFilter(name);
        });
        this.updateView();
      }
    }

    // handleDateInputs() {

    // }

    handleAgeRange(e) {
      let { name } = e.target;
      const { value } = e.target;
      const rangeOutput = e.target.previousElementSibling;

      console.log(name, value);

      name = name.split('_').reduce((accumulator, substring, index) => (index === 0 ? `${accumulator}${substring}` : `${accumulator}${substring.charAt(0).toUpperCase()}${substring.slice(1)}`), '');

      console.log(name);

      updateRangeOutput({ rangeInput: e.target, rangeOutput });

      this.lmsEventsArray.forEach((lmsEvent) => lmsEvent.removeFilter(name));

      /** Normally you'd just use >= but I think it's more expressive to say NOT <= */
      this.lmsEventsArray.filter((lmsEvent) => !(lmsEvent.maxAge <= parseInt(value, 10)))
        .forEach((lmsEvent) => {
          lmsEvent.addFilter(name);
        });
      this.updateView();
    }

    updateView() {
      console.log('update view');
      let checkedCheckboxFacets = this.checkboxFacets
        .filter((checkboxFacet) => checkboxFacet.checked)
        .map((checkedCheckboxFacet) => (
          { name: checkedCheckboxFacet.name, value: checkedCheckboxFacet.value }
        ));
      checkedCheckboxFacets = [...checkedCheckboxFacets.reduce((accumulator, { name, value }) => {
        const existingValues = accumulator.get(name);
        if (existingValues) {
          return accumulator.set(name, [...existingValues, value]);
        }
        return accumulator.set(name, [value]);
      }, new Map()).entries()]
        .map(([name, values]) => ({ name, values }));

      const activeRangeInputs = this.rangeFacets
        .filter((rangeFacet) => rangeFacet.value !== '120');

      this.lmsEventsArray.forEach((lmsEvent) => {
        if (!checkedCheckboxFacets.length && !activeRangeInputs.length) { lmsEvent.show(); return; }
        if (checkedCheckboxFacets.every((checkedCheckboxFacet) => {
          const { name, values } = checkedCheckboxFacet;
          return values.some((value) => value === lmsEvent[name]);
        }) && !lmsEvent.getFilters().includes('maxAge')) { lmsEvent.show(); return; }
        lmsEvent.hide();
      });
    }
  }

  var main = { LMSEvents, uploadImage, updateRangeOutput };

  return main;

}));
