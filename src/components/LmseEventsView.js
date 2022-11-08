import LmseEventsFilter from '../LmseEventsFilter';
import Observable from '../utils/Observable';

export default class LmseEventsView {
  constructor({ entryPoint, facets }) {
    this.entryPoint = entryPoint;
    this.facets = facets;
    this.lmseEventsFilter = new LmseEventsFilter(this.facets);
    this.Observable = Observable;
  }

  init() {
    this.lmseEventsFilter.init();
    this.Observable.subscribe(this.updateView);
  }

  updateView(filters) {

  }

  async getEvents() {

  }

  getRequestParameters(filters) {

  }
}
