export default class LMSEvent {
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
