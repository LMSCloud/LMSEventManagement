export default function lmseEventCardSkeleton() {
  const element = document.createElement('div');
  element.classList.add('lms-event', 'lmse-card', 'skeleton-card');
  element.innerHTML = `
      <div class="lmse-card-head">
        <div class="skeleton-img skeleton"></div>
      </div>
      <div class="lmse-card-body">
        <div class="skeleton-h5 skeleton"></div>
        <ul>
          <li class="skeleton-line skeleton"></li>
          <li class="skeleton-line skeleton"></li>
        </ul>
      </div>
    `;

  return element;
}
