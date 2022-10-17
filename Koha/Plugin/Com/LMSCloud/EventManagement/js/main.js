(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.EventManagementBundle = factory());
})(this, (function () { 'use strict';

  class LMSEvent {
    constructor({ element }) {
      this.elementRef = element;
      const {
        targetGroup, eventType, branch, maxAge, publicReg, startTime, endTime, filteredBy,
      } = element.dataset;
      this.targetGroup = targetGroup;
      this.eventType = eventType;
      this.branch = branch;
      this.maxAge = maxAge;
      this.publicReg = publicReg;
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

      this.checkboxFacets = Array.from(this.facets).filter((facet) => facet.type === 'checkbox');

      this.facets.forEach((facet) => {
        facet.addEventListener('change', (e) => this.handleCheckboxes(e));
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
          this.updateView();
        });
        return;
      }

      if (!checked) {
        this.getSelectedEvents({ name, value }).forEach((lmsEvent) => {
          lmsEvent.removeFilter(name);
          this.updateView();
        });
      }
    }

    // handleDateInputs() {

    // }

    // handleAgeSlider() {

    // }

    updateView() {
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
      this.lmsEventsArray.forEach((lmsEvent) => {
        if (!checkedCheckboxFacets.length) { lmsEvent.show(); return; }
        if (checkedCheckboxFacets.every((checkedCheckboxFacet) => {
          const { name, values } = checkedCheckboxFacet;
          return values.some((value) => value === lmsEvent[name]);
        })) { lmsEvent.show(); return; }
        lmsEvent.hide();
      });
    }
  }

  var main = { LMSEvents };

  return main;

}));
