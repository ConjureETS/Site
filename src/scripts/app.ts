import BulmaCarousel from 'bulma-carousel';

export function initApp() {
  addCopyrightCurrentDate();
}

export function initCarousel() {
  // Initialize all carousels with the given selector
  const carousels = BulmaCarousel.attach('.slider', {
    autoplay: true,
    pagination: false,
    loop: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite: true,
    icons: {
      previous: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 100 100" width="100" height="100"><defs><clipPath id="_clipPath_Rmt62eEg1OXF13UQV6A0tZ7nRrSHuqzl"><rect width="100" height="100"/></clipPath></defs><g clip-path="url(#_clipPath_Rmt62eEg1OXF13UQV6A0tZ7nRrSHuqzl)"><path d=" M 68.738 87.477 L 68.738 87.477 L 31.262 50 L 68.738 12.523" fill="none" vector-effect="non-scaling-stroke" stroke-width="8" stroke="rgb(132,132,132)" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="3"/></g></svg>',
      next: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 100 100" width="100" height="100"><defs><clipPath id="_clipPath_sc80dOHRo7GcAKylIDWHu4HjiUHjgH8R"><rect width="100" height="100"/></clipPath></defs><g clip-path="url(#_clipPath_sc80dOHRo7GcAKylIDWHu4HjiUHjgH8R)"><path d=" M 39 12.523 L 39 12.523 L 76.477 50 L 39 87.477" fill="none" vector-effect="non-scaling-stroke" stroke-width="8" stroke="rgb(132,132,132)" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="3"/></g></svg>',
    },
  });
  return carousels;
}

function addCopyrightCurrentDate() {
  const footer = document.querySelector('footer');
  if (footer) {
    const p = footer.querySelector('p');
    if (p) {
      const yearSpan = p.querySelector('#current-year');
      if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear().toString();
      }
    }
  }
}

export function animateNumbers(item: HTMLElement) {
  const intervalTime = 1;
  const incrementation = 7;

  setTimeout(() => {
    let endValue = item.getAttribute('data-endvalue');
    endValue = String(
      endValue === null ? new Date().getFullYear() : parseInt(endValue || '2024')
    );
    const duration = parseInt(endValue) * intervalTime / incrementation;
    let currentDuration = duration;

    const animation = setInterval(() => {
      currentDuration -= intervalTime;
      const val = parseInt(item.innerHTML || '0');
      const newValue = val + incrementation > parseInt(endValue) ? parseInt(endValue) : val + incrementation;
      item.innerHTML = pad(newValue, 4);

      if (currentDuration <= 0) {
        clearInterval(animation);
      }
    }, intervalTime);
  }, parseInt(item.getAttribute('data-delay') || '250'));
}

function pad(n: number, width: number, z: string = '0'): string {
  const nStr = n + '';
  return nStr.length >= width ? nStr : new Array(width - nStr.length + 1).join(z) + nStr;
}

export function setupActivityButtons() {
  const buttons = document.querySelectorAll('section#activites .is-mtlgj-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', showActivityContent);
  });
}

function showActivityContent(e: Event) {
  const target = e.target as HTMLElement;
  if (target && target.parentElement) {
    const parent = target.parentElement.parentElement?.parentElement;
    if (parent) {
      const headline = parent.querySelector('.headline');
      const subsection = parent;

      if (headline) {
        headline.classList.toggle('toggle-visibility');
      }
      if (subsection) {
        subsection.classList.toggle('slide');
      }
    }
  }
}
