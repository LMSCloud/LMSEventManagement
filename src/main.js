import LmseEventCard from './components/LmseEventCard';
import LmseEventsView from './components/LmseEventsView';

import uploadImage from './utils/uploadImage';
import updateRangeOutput from './utils/updateRangeOutput';

const customElementRegistry = window.customElements;
customElementRegistry.define('lmse-event', LmseEventCard);

export default {
  LmseEventsView, uploadImage, updateRangeOutput,
};
