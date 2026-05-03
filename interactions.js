/* ── INTERACTIONS ─────────────────────────────────────────────── */

(function () {

  const lerp = (a, b, t) => a + (b - a) * t;

  /* ── 1. FLOATING IMAGE PREVIEW (work list) ─────────────────── */

  const preview    = document.getElementById('work-preview');
  const previewImg = document.getElementById('work-preview-img');

  if (preview && previewImg) {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx, cy = my;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });

    (function tick() {
      cx = lerp(cx, mx, 0.1);
      cy = lerp(cy, my, 0.1);
      preview.style.left = cx + 'px';
      preview.style.top  = cy + 'px';
      requestAnimationFrame(tick);
    })();

    document.querySelectorAll('.work-link[data-img]').forEach(link => {
      link.addEventListener('mouseenter', () => {
        const src = link.dataset.img;
        if (previewImg.dataset.loaded !== src) {
          previewImg.src = src;
          previewImg.dataset.loaded = src;
        }
        preview.classList.add('is-visible');
      });
      link.addEventListener('mouseleave', () => {
        preview.classList.remove('is-visible');
      });
    });
  }


  /* ── 2. SCROLL BLUR ON CARDS ───────────────────────────────── */

  const stackWraps = document.querySelectorAll('.proj-stack-wrap');

  if (stackWraps.length) {
    const STICKY_TOP = 60;

    function updateCardBlur() {
      stackWraps.forEach(wrap => {
        const card = wrap.querySelector('.proj-stack-item');
        if (!card) return;

        const wRect   = wrap.getBoundingClientRect();
        const scrolled = -(wRect.top - STICKY_TOP); // how far the wrap has scrolled past sticky point

        if (scrolled <= 0) {
          card.style.filter    = '';
          card.style.transform = '';
          card.style.opacity   = '';
          return;
        }

        const cardH    = card.offsetHeight;
        const exitStart = wrap.offsetHeight - cardH * 0.35;
        const progress  = Math.max(0, Math.min(1, (scrolled - exitStart) / (cardH * 0.35)));

        card.style.filter    = progress > 0 ? `blur(${progress * 10}px)`          : '';
        card.style.transform = progress > 0 ? `scale(${1 - progress * 0.04})`     : '';
        card.style.opacity   = progress > 0 ? String(1 - progress * 0.45)         : '';
      });
    }

    window.addEventListener('scroll', updateCardBlur, { passive: true });
    updateCardBlur();
  }


  /* ── 3. SCROLL GRADIENT VEIL ──────────────────────────────── */

  const veil = document.createElement('div');
  veil.className = 'scroll-veil';
  document.body.appendChild(veil);

  function updateVeil() {
    if (window.scrollY > 20) {
      veil.classList.add('is-visible');
    } else {
      veil.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', updateVeil, { passive: true });
  updateVeil();


  /* ── 4. PAGE TRANSITION ─────────────────────────────────────── */

  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);

  // Fade in (reveal) on load
  requestAnimationFrame(() => {
    requestAnimationFrame(() => overlay.classList.add('is-leaving'));
  });

  // Fade out on internal link click
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') ||
        href.startsWith('http') || link.target === '_blank') return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.remove('is-leaving');
      setTimeout(() => { window.location.href = href; }, 420);
    });
  });

})();
