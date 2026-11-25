/* 18 Years of Love — progressive, dependency-free interactions. */
(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Self-building page intro. The page remains readable if JavaScript is unavailable.
  function startBuildIntro() {
    if (reduceMotion) return;
    const body = document.body;
    if (!body) return;
    body.classList.add('intro-active');

    const intro = document.createElement('div');
    intro.className = 'build-intro';
    intro.setAttribute('role', 'status');
    intro.setAttribute('aria-label', 'Opening your anniversary memories');
    intro.innerHTML = `
      <div class="build-orbit" aria-hidden="true"><span>♡</span></div>
      <p class="build-kicker">A LITTLE WORLD MADE WITH LOVE</p>
      <h2 class="build-title">18 Years <em>of Love</em></h2>
      <div class="build-track" aria-hidden="true"><span></span></div>
      <p class="build-caption">Putting your memories together…</p>`;
    body.appendChild(intro);

    // Reveal the page in an intentional sequence while the intro fades away.
    const revealTargets = body.querySelectorAll('.topbar, .page-content, .page-art, .surprise-stage > .eyebrow, .surprise-stage > h1, .surprise-stage > .page-copy, .gift-button, footer');
    revealTargets.forEach((el, i) => {
      el.classList.add('build-in');
      el.style.setProperty('--build-delay', `${Math.min(i * 95, 650)}ms`);
    });

    window.setTimeout(() => {
      intro.classList.add('build-intro-out');
      body.classList.remove('intro-active');
      body.classList.add('site-built');
      window.setTimeout(() => intro.remove(), 700);
    }, 1900);
  }

  // Friendly fallback for missing photographs instead of broken-image icons.
  function protectImages() {
    document.querySelectorAll('img').forEach((img) => {
      img.addEventListener('error', () => {
        img.classList.add('image-unavailable');
        img.alt = img.alt || 'Anniversary photograph';
      }, { once: true });
    });
  }

  function setupSurprise() {
    const button = document.getElementById('giftButton');
    const burst = document.getElementById('photoBurst');
    const message = document.getElementById('surpriseMessage');
    const stage = document.querySelector('.surprise-stage');
    if (!button || !burst || !message || !stage) return;

    const photos = Array.from({ length: 9 }, (_, i) => `photo-${String(i + 1).padStart(2, '0')}.jpg`);
    let opened = false;

    button.addEventListener('click', () => {
      if (opened) return;
      opened = true;
      button.classList.add('opened');
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('aria-label', 'Anniversary surprise opened');
      stage.classList.add('opened');
      message.classList.add('show');
      const hint = button.querySelector('.tap-hint');
      if (hint) hint.textContent = 'Your memories are here ♡';

      const mobile = window.matchMedia('(max-width: 600px)').matches;
      const rx = Math.min(window.innerWidth * (mobile ? 0.34 : 0.36), mobile ? 150 : 390);
      const ry = Math.min(window.innerHeight * (mobile ? 0.25 : 0.29), mobile ? 170 : 245);

      photos.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Anniversary memory ${index + 1}`;
        img.loading = 'eager';
        img.decoding = 'async';
        img.className = 'burst-photo';
        img.style.setProperty('--photo-index', index);
        burst.appendChild(img);

        const angle = (index / photos.length) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * rx;
        const y = Math.sin(angle) * ry;
        const rotation = (index % 2 ? 1 : -1) * (5 + (index % 4) * 2);
        img.style.setProperty('--x', `${x}px`);
        img.style.setProperty('--y', `${y}px`);
        img.style.setProperty('--r', `${rotation}deg`);
        // Stagger each photo slightly so the collage assembles one memory at a time.
        window.setTimeout(() => img.classList.add('fly'), 120 + index * 105);
      });
    });
  }

  function init() {
    protectImages();
    setupSurprise();
    startBuildIntro();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
