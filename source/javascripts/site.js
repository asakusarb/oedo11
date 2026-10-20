const clouds = [...document.querySelectorAll('.hero__cloud--random')];

const cloudSlots = [
  {top: [5, 10], left: [-20, -14], width: [32, 40]},
  {top: [11, 17], left: [86, 95], width: [26, 34]},
  {top: [26, 34], left: [-15, -9], width: [32, 40]},
  {top: [39, 47], left: [87, 96], width: [30, 39]},
  {top: [57, 65], left: [-12, -4], width: [26, 34]},
  {top: [68, 75], left: [85, 94], width: [32, 40]}
];

const randomBetween = ([min, max]) => min + Math.random() * (max - min);

clouds.forEach((cloud, index) => {
  const slot = cloudSlots[index % cloudSlots.length];
  const duration = randomBetween([60, 90]);
  const direction = Math.random() > 0.5 ? 1 : -1;
  const sceneWidth = cloud.closest('.hero__scene').getBoundingClientRect().width;
  const drift = direction * sceneWidth * randomBetween([0.08, 0.12]);
  const edgeOffset = window.innerWidth >= 900 ? (index % 2 === 0 ? -12 : 12) : 0;
  cloud.style.setProperty('--cloud-top', `${randomBetween(slot.top)}%`);
  cloud.style.setProperty('--cloud-left', `${randomBetween(slot.left) + edgeOffset}%`);
  cloud.style.setProperty('--cloud-width', `${randomBetween(slot.width)}%`);
  cloud.style.setProperty('--cloud-duration', `${duration}s`);
  cloud.style.setProperty('--cloud-delay', `${-Math.random() * duration}s`);
  cloud.style.setProperty('--cloud-drift-start', `${-drift}px`);
  cloud.style.setProperty('--cloud-drift-end', `${drift}px`);
  cloud.style.setProperty('--cloud-depth', `${randomBetween([1.08, 1.16])}`);
  cloud.style.setProperty('--cloud-far-opacity', `${randomBetween([0.68, 0.82])}`);
  cloud.style.setProperty('--cloud-flip', Math.random() > 0.5 ? 'scaleX(-1)' : 'none');
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = [
  '.hero__animal--pigeon',
  '.hero__person',
  '.hero__animal--alpaca',
  '.hero__animal--gorilla'
].map((selector) => document.querySelector(selector)).filter(Boolean);

const revealStartDelay = 350;
const revealStepDelay = 420;
const autoScrollDelay = 2000;

if (!prefersReducedMotion) {
  revealElements.forEach((element, index) => {
    window.setTimeout(() => element.classList.add('is-visible'), revealStartDelay + index * revealStepDelay);
  });
}

const sign = document.querySelector('.hero__sign');

if (sign && !prefersReducedMotion && window.scrollY < 2 && !window.location.hash) {
  const interruptEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
  let canceled = false;
  let animationFrame = null;
  let scrollTimeout = null;

  const removeInterruptListeners = () => {
    interruptEvents.forEach((eventName) => window.removeEventListener(eventName, interruptAutoScroll));
  };

  const interruptAutoScroll = () => {
    canceled = true;
    window.clearTimeout(scrollTimeout);
    if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    removeInterruptListeners();
  };

  const animateToSign = () => {
    if (canceled || window.scrollY >= 2) return;

    const signBounds = sign.getBoundingClientRect();
    const startY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = Math.max(0, Math.min(maxScroll, startY + signBounds.top - (window.innerHeight - signBounds.height) / 2));
    const duration = 6000;
    let startTime = null;

    const frame = (timestamp) => {
      if (canceled) return;
      if (startTime === null) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo({top: startY + (targetY - startY) * easedProgress, behavior: 'instant'});

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(frame);
      } else {
        animationFrame = null;
        removeInterruptListeners();
      }
    };

    animationFrame = window.requestAnimationFrame(frame);
  };

  interruptEvents.forEach((eventName) => window.addEventListener(eventName, interruptAutoScroll, {once: true, passive: true}));
  scrollTimeout = window.setTimeout(animateToSign, autoScrollDelay);
}

// Scroll back to the top without leaving "#top" in the URL, so a reload still plays the auto-scroll.
const brandLink = document.querySelector('.site-brand');

if (brandLink) {
  brandLink.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({top: 0});
    if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
  });
}
