const template = document.createElement('template');
// eslint-disable-next-line no-undef
template.innerHTML = `
  <div
    class="lms-event card"
    style="max-width: 18rem;"
  >
    <slot name="event-id">
      <slot name="event-image"></slot>
    </slot>
    <div class="card-body">
      <slot name="event-name"></slot>
      <p class="card-text">
        <slot name="start-time"></slot>
      </p>
    </div>
  </div>
`;

export default class LmseEventCard extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(template.content.cloneNode(true));
  }
}
