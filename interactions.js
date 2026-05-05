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


  /* ── 3. THOUGHT ACCORDION ──────────────────────── */

  document.querySelectorAll('.proj-thought-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      trigger.closest('.proj-thought-item').classList.toggle('is-open');
    });
  });


  /* ── 4. ARTIFACTS GRID ──────────────────────────── */

  const artifactsGrid = document.getElementById('artifacts-grid');
  if (artifactsGrid) {
    // Randomise order on each load
    const items = [...artifactsGrid.children];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      artifactsGrid.appendChild(items[j]);
      items.splice(j, 1);
    }

    // Modal
    const modal    = document.getElementById('artifacts-modal');
    const modalImg = document.getElementById('artifacts-modal-img');
    const modalLbl = document.getElementById('artifacts-modal-title');
    const backdrop = modal.querySelector('.artifacts-modal-backdrop');
    const closeBtn = modal.querySelector('.artifacts-modal-close');

    function openModal(src, title) {
      modalImg.src = src;
      modalImg.alt = title;
      modalLbl.textContent = title;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => { modalImg.src = ''; }, 250);
    }

    artifactsGrid.addEventListener('click', e => {
      const item = e.target.closest('.artifact-item');
      if (!item) return;
      const img = item.querySelector('img');
      openModal(img.src, item.dataset.title || img.alt);
    });

    backdrop.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

})();
