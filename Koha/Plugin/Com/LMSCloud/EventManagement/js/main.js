(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.EventManagementBundle = factory());
})(this, (function () { 'use strict';

  const template = document.createElement('template');
  // eslint-disable-next-line no-undef
  template.innerHTML = `
  <div
    class="lms-event card"
    style="max-width: 18rem;"
  >
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

  class LmseEventsFilter {
    constructor(facets) {
      this.facets = facets;
      this.filters = {};
    }

    init() {
      this.facets.forEach((facet) => {
        if (facet.type === 'checkbox') {
          this.filters[facet.value] = facet.checked;
          facet.addEventListener('change', (e) => {
            this.filters[e.target.value] = e.target.checked;
            console.log(this.filters);
          });
        }

        if (facet.type === 'date') {
          this.filters[facet.name] = facet.value;
          facet.addEventListener('change', (e) => {
            this.filters[e.target.name] = e.target.value;
            console.log(this.filters);
          });
        }

        if (facet.type === 'range') {
          this.filters[facet.name] = parseInt(facet.value, 10);
          facet.addEventListener('change', (e) => {
            this.filters[e.target.name] = parseInt(e.target.value, 10);
            console.log(this.filters);
          });
        }
      });
    }

    getFilters() {
      return this.filters;
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
    LmseEventsFilter, uploadImage, updateRangeOutput,
  };

  return main;

}));
