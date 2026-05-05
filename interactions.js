/* ── INTERACTIONS ─────────────────────────────────────────────── */

(function () {

  /* ── 1. WORK GRID BLUR-ON-HOVER ───────────────────────────── */

  const workGrid = document.querySelector('.work-grid');
  const workRows = document.querySelectorAll('.work-row');

  if (workGrid && workRows.length) {
    workRows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        workGrid.classList.add('row-hovered');
        row.classList.add('is-hovered');
      });
      row.addEventListener('mouseleave', () => {
        workGrid.classList.remove('row-hovered');
        row.classList.remove('is-hovered');
      });
    });
  }


  /* ── 2. SCROLL GRADIENT VEIL ──────────────────────────────── */

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


  /* ── 2. PAGE TRANSITION ─────────────────────────────────────── */

  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => overlay.classList.add('is-leaving'));
  });

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


  /* ── 3. SKETCHBOOK TABS ─────────────────────────── */

  const sketchbookTabs = document.querySelectorAll('.sketchbook-tab');
  sketchbookTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sketchbookTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const target = tab.dataset.tab;
      document.getElementById('sketchbook-3d').style.display = target === '3d' ? '' : 'none';
      document.getElementById('sketchbook-posters').style.display = target === 'posters' ? '' : 'none';
    });
  });

})();
