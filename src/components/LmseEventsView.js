import LmseEventsFilter from '../LmseEventsFilter';
import Observable from '../utils/Observable';
import getRequestParameters from '../utils/getRequestParameters';

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
