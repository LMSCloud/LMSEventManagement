/**
 * The events property expects an array of references to cards with an lms-event class.
 * The facets property expects an array of references to input elements with an lms-facet class.
 */

import LMSEvent from './LMSEvent';
import { updateRangeOutput } from './Utils';

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

    name = name
      .split('_')
      .reduce(
        (accumulator, substring, index) => (index === 0
          ? `${accumulator}${substring}`
          : `${accumulator}${substring.charAt(0).toUpperCase()}${substring.slice(1)}`),
        '',
      );

    updateRangeOutput({ rangeInput: e.target, rangeOutput });

    this.lmsEventsArray.forEach((lmsEvent) => lmsEvent.removeFilter(name));

    if (value !== '120') {
      /** Normally you'd just use >= but in this case I think it's more expressive to say NOT <=
       *  because we want to filter items that have a max age BIGGER than our value */
      this.lmsEventsArray.filter((lmsEvent) => !(lmsEvent.maxAge <= parseInt(value, 10)))
        .forEach((lmsEvent) => {
          lmsEvent.addFilter(name);
        });
    }
    this.updateView();
  }

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

    /** Needs to change if we ever get more range inputs */
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
