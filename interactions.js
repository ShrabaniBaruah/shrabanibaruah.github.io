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


  /* ── 4. ARTIFACTS INFINITE CANVAS ──────────────────── */

  const afViewport = document.getElementById('af-viewport');
  const afDataEl   = document.getElementById('artifacts-data');

  if (afViewport && afDataEl) {
    const rawData = JSON.parse(afDataEl.textContent);

    // Shuffle
    for (let i = rawData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rawData[i], rawData[j]] = [rawData[j], rawData[i]];
    }

    // Responsive layout constants
    const vpW = afViewport.offsetWidth;
    let COLS, IMG_W, GAP_X, GAP_Y, PAD;
    if (vpW < 600) {
      COLS = 3; IMG_W = 110; GAP_X = 20; GAP_Y = 20; PAD = 30;
    } else if (vpW < 1024) {
      COLS = 5; IMG_W = 140; GAP_X = 50; GAP_Y = 50; PAD = 50;
    } else {
      COLS = 8; IMG_W = 170; GAP_X = 80; GAP_Y = 80; PAD = 80;
    }

    // Pad to a full multiple of COLS so no row is incomplete
    const remainder = rawData.length % COLS;
    if (remainder !== 0) {
      const needed = COLS - remainder;
      for (let i = 0; i < needed; i++) rawData.push(rawData[i]);
    }
    const ROWS   = rawData.length / COLS;
    const TILE_W = PAD + COLS * (IMG_W + GAP_X);
    const TILE_H = PAD + ROWS * (IMG_W + GAP_Y);

    const layouts = rawData.map((d, i) => ({
      src: d.src, title: d.title, w: IMG_W,
      x: PAD / 2 + (i % COLS) * (IMG_W + GAP_X),
      y: PAD / 2 + Math.floor(i / COLS) * (IMG_W + GAP_Y)
    }));

    // Build 3x3 tiled stage
    const stage = document.createElement('div');
    stage.className = 'af-stage';
    stage.style.width  = TILE_W * 3 + 'px';
    stage.style.height = TILE_H * 3 + 'px';

    for (let tr = 0; tr < 3; tr++) {
      for (let tc = 0; tc < 3; tc++) {
        layouts.forEach(item => {
          const el = document.createElement('div');
          el.className     = 'artifact-item';
          el.dataset.title = item.title;
          el.style.cssText = `left:${tc*TILE_W+item.x}px;top:${tr*TILE_H+item.y}px;width:${item.w}px`;
          const img = document.createElement('img');
          img.src = item.src; img.alt = item.title; img.loading = 'lazy';
          el.appendChild(img);
          stage.appendChild(el);
        });
      }
    }
    afViewport.appendChild(stage);

    // Pan state — start centered on middle tile
    const vw = afViewport.offsetWidth;
    const vh = afViewport.offsetHeight;
    let tx = -(TILE_W * 1.5 - vw / 2);
    let ty = -(TILE_H * 1.5 - vh / 2);

    function setTransform() {
      stage.style.transform = `translate(${tx}px,${ty}px)`;
    }

    function wrap() {
      const cx = -tx + vw / 2, cy = -ty + vh / 2;
      if (cx < TILE_W)        tx -= TILE_W;
      else if (cx >= TILE_W*2) tx += TILE_W;
      if (cy < TILE_H)        ty -= TILE_H;
      else if (cy >= TILE_H*2) ty += TILE_H;
    }

    setTransform();

    // Drag
    let dragging = false, didDrag = false, ox, oy, ptx, pty;

    afViewport.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      dragging = true; didDrag = false;
      ox = e.clientX; oy = e.clientY; ptx = tx; pty = ty;
      afViewport.classList.add('is-dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const dx = e.clientX - ox, dy = e.clientY - oy;
      if (Math.abs(dx) + Math.abs(dy) > 4) didDrag = true;
      tx = ptx + dx; ty = pty + dy;
      wrap(); setTransform();
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      afViewport.classList.remove('is-dragging');
    });

    // Touch
    afViewport.addEventListener('touchstart', e => {
      const t = e.touches[0];
      dragging = true; didDrag = false;
      ox = t.clientX; oy = t.clientY; ptx = tx; pty = ty;
      e.preventDefault();
    }, { passive: false });

    afViewport.addEventListener('touchmove', e => {
      if (!dragging) return;
      const t = e.touches[0];
      const dx = t.clientX - ox, dy = t.clientY - oy;
      if (Math.abs(dx) + Math.abs(dy) > 4) didDrag = true;
      tx = ptx + dx; ty = pty + dy;
      wrap(); setTransform();
      e.preventDefault();
    }, { passive: false });

    afViewport.addEventListener('touchend', () => { dragging = false; });

    // Trackpad / wheel pan
    afViewport.addEventListener('wheel', e => {
      tx -= e.deltaX; ty -= e.deltaY;
      wrap(); setTransform();
      e.preventDefault();
    }, { passive: false });

    // Modal
    const modal    = document.getElementById('artifacts-modal');
    const modalImg = document.getElementById('artifacts-modal-img');
    const modalLbl = document.getElementById('artifacts-modal-title');

    function openModal(src, title) {
      modalImg.src = src; modalImg.alt = title;
      modalLbl.textContent = title;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => { modalImg.src = ''; }, 240);
    }

    afViewport.addEventListener('click', e => {
      if (didDrag) return;
      const item = e.target.closest('.artifact-item');
      if (!item) return;
      openModal(item.querySelector('img').src, item.dataset.title);
    });

    modal.querySelector('.artifacts-modal-backdrop').addEventListener('click', closeModal);
    modal.querySelector('.artifacts-modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

})();
