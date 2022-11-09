export default class LmseEventsFilter {
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

  getFilters() {
    return this.filters;
  }
}
