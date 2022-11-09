import LmseEventsFilter from '../components/class/LmseEventsFilter';
import lmseEventCard from '../components/function/lmseEventCard';

import Observable from '../utils/Observable';
import getRequestParameters from '../utils/getRequestParameters';

export default class LmseEventsView {
  constructor({ entryPoint, facets }) {
    this.entryPoint = entryPoint;
    this.facets = facets;
    this.Observable = new Observable(this);
    this.lmseEventsFilter = new LmseEventsFilter(this.facets, this.Observable);
  }

  init() {
    this.lmseEventsFilter.init();
    this.Observable.subscribe(this.updateView);
    this.updateView({});
  }

  async updateView(filters) {
    const lmseEvents = await LmseEventsView.getEvents(filters);
    this.entryPoint.innerHTML = '';

    const eventCards = lmseEvents.reduce(
      (accumulator, lmseEvent) => [
        ...accumulator, lmseEventCard({
          id: lmseEvent.id,
          image: lmseEvent.image,
          name: lmseEvent.name,
          startTime: lmseEvent.start_time,
        }),
      ],
      [],
    );

    eventCards.forEach((eventCard) => {
      this.entryPoint.appendChild(eventCard);
    });
  }

  static async getEvents(filters) {
    const requestParameters = getRequestParameters(filters);
    const response = await fetch(`/api/v1/contrib/eventmanagement/lms_events${requestParameters ? '?' : ''}${requestParameters}`);

    return response.json();
  }
}
