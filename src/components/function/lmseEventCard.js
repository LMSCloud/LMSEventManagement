export default function lmseEventCard({
  id, image, name, startTime,
}) {
  const element = document.createElement('div');
  element.classList.add('lms-event', 'card');
  element.style.maxWidth = '18rem';
  element.innerHTML = `
      <a href="/opac-events?op=detail&id=${id}">
        <img src="/lms-event-management/images/${image}"
          class="card-img-top" 
          alt="..."
          height="210"
        >
      </a>
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">
          <time datetime="${startTime}">${startTime}</time>
        </p>
      </div>
  `;

  return element;
}
