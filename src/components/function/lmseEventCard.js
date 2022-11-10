import transformTimestamp from '../../utils/transformTimestamp';

export default function lmseEventCard({ lmseEvent }) {
  const element = document.createElement('div');
  element.classList.add('lms-event', 'lmse-card');
  element.innerHTML = `
      <div class="lmse-card-head">
        <a href="/opac-events?op=detail&id=${lmseEvent.id}">
          <img src="/lms-event-management/images/${lmseEvent.image}"
            alt="..."
            height="210"
          >
        </a>
      </div>
      <div class="lmse-card-body">
        <h5>${lmseEvent.name}</h5>
        <p>
          <i class="fa fa-calendar" aria-hidden="true"></i>
          <time datetime="${lmseEvent.start_time}">${transformTimestamp(lmseEvent.start_time)}</time>
        </p>
      </div>
  `;

  return element;
}
