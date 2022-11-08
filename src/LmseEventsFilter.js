export default class LmseEventsFilter {
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
