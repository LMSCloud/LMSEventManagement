/**
 * The events property expects an array of references to cards with an lms-event class.
 * The facets property expects an array of references to input elements with an lms-facet class.
 */

import LMSEvent from './LMSEvent';

export default class LMSEvents {
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
