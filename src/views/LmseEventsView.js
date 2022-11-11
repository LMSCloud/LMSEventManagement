import LmseEventsFilter from '../components/class/LmseEventsFilter';
import lmseEventCard from '../components/function/lmseEventCard';
import lmseEventCardSkeleton from '../components/function/lmseEventCardSkeleton';

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
    this.showSkeleton();
    this.lmseEventsFilter.init();
    this.Observable.subscribe(this.updateView);
    this.updateView({});
  }

  async updateView(filters) {
    const lmseEvents = await LmseEventsView.getEvents(filters);
    this.entryPoint.innerHTML = '';

    const eventCards = lmseEvents.reduce(
      (accumulator, lmseEvent) => [
        ...accumulator, lmseEventCard({ lmseEvent }),
      ],
      [],
    );

    eventCards.forEach((eventCard) => {
      this.entryPoint.appendChild(eventCard);
    });
  }

  showSkeleton() {
    this.entryPoint.innerHTML = '';

    for (let index = 1; index <= 6; index += 1) {
      this.entryPoint.appendChild(lmseEventCardSkeleton());
    }
  }

  resetEventsFilter() {
    this.lmseEventsFilter.resetFacets();
  }

  static async getEvents(filters) {
    const requestParameters = getRequestParameters(filters);
    const response = await fetch(`/api/v1/contrib/eventmanagement/lms_events${requestParameters ? '?' : ''}${requestParameters}`);

    return response.json();
  }
}
