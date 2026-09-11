/* ============================================================
   Victor & Diana — wedding invitation interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- CONFIG (edit these for your own wedding) ---------------- */
  const EVENT = {
    title: 'Wedding of Victor & Diana',
    dateStart: '20261113T100500',
    dateEnd:   '20261113T130500',
    venueName: 'Grand Rose Garden Hall',
    venueAddress: '45 Blossom Avenue',
    mapsQuery: 'Grand Rose Garden Hall, 45 Blossom Avenue',
  };

  /* ================= ENVELOPE INTRO ================= */
  const envelopeScreen = document.getElementById('envelopeScreen');
  const sealBtn = document.getElementById('sealBtn');
  const main = document.getElementById('main');

  sealBtn.addEventListener('click', () => {
    envelopeScreen.classList.add('opening');
    document.body.style.overflow = '';
    setTimeout(() => {
      envelopeScreen.classList.add('hidden');
      main.classList.remove('main-hidden');
      startPetals();
    }, 900);
  }, { once: true });

  document.body.style.overflow = 'hidden';

  /* ================= FALLING PETALS (hero) ================= */
  const petalField = document.getElementById('petalField');
  const PETAL_COLORS = ['#c23b53', '#e08a9b', '#efc6c9', '#a8324a'];
  let petalTimer = null;

  function makePetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = 10 + Math.random() * 14;
    const startX = Math.random() * 100;
    const drift = (Math.random() * 140 - 70) + 'px';
    const spin = (Math.random() * 520 - 260) + 'deg';
    const duration = 7 + Math.random() * 6;
    const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];

    petal.style.left = startX + '%';
    petal.style.width = size + 'px';
    petal.style.height = size * 0.8 + 'px';
    petal.style.setProperty('--drift', drift);
    petal.style.setProperty('--spin', spin);
    petal.style.animation = `fall ${duration}s linear forwards`;
    petal.innerHTML = `<svg viewBox="0 0 20 16" width="100%" height="100%">
      <path d="M10 0C14 2 20 6 18 11C16 15 4 15 2 11C0 6 6 2 10 0Z" fill="${color}"/>
    </svg>`;

    petalField.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000 + 200);
  }

  function startPetals() {
    for (let i = 0; i < 6; i++) setTimeout(makePetal, i * 300);
    petalTimer = setInterval(makePetal, 750);
  }

  // stop spawning once the hero scrolls far out of view (perf)
  const hero = document.getElementById('hero');
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting && petalTimer) {
        clearInterval(petalTimer);
        petalTimer = null;
      } else if (entry.isIntersecting && !petalTimer && !main.classList.contains('main-hidden')) {
        petalTimer = setInterval(makePetal, 750);
      }
    });
  }, { threshold: 0.05 });
  heroObserver.observe(hero);

  /* ================= PARALLAX ================= */
  const heroBg = document.getElementById('heroBg');
  const parallaxEls = document.querySelectorAll('.parallax-el');

  function onScroll() {
    const y = window.scrollY;
    if (heroBg) {
      const speed = parseFloat(heroBg.dataset.speed || 0.3);
      heroBg.style.transform = `translateY(${y * speed}px) scale(1.08)`;
    }
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.speed || 0.2);
      const rect = el.parentElement.getBoundingClientRect();
      const offset = (window.innerHeight - rect.top) * speed;
      el.style.transform = `translateY(${offset * 0.15}px)`;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ================= SCRATCH CARD ================= */
  const canvas = document.getElementById('scratchCanvas');
  const scratchHint = document.getElementById('scratchHint');
  const scratchCard = document.getElementById('scratchCard');
  let scratchDone = false;

  function sizeCanvas() {
    const rect = scratchCard.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    drawFoil();
  }

  function drawFoil() {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#e9d9b8');
    grad.addColorStop(0.35, '#f6ecd2');
    grad.addColorStop(0.6, '#cfa96b');
    grad.addColorStop(1, '#b98b46');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // subtle diagonal sheen lines
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#fff';
    for (let i = -h; i < w; i += 14) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = 'rgba(90,60,20,0.55)';
    ctx.font = '600 15px "Cormorant Garamond", serif';
    ctx.textAlign = 'center';
  }

  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);

  let isScratching = false;
  let scratchedPixels = 0;
  const SAMPLE = 8; // downsample factor for performance

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function scratchAt(x, y) {
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  function checkProgress() {
    if (scratchDone) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const data = ctx.getImageData(0, 0, w, h, ).data;
    let cleared = 0, total = 0;
    for (let i = 3; i < data.length; i += 4 * SAMPLE) {
      total++;
      if (data[i] < 20) cleared++;
    }
    const pct = cleared / total;
    if (pct > 0.55) {
      revealCard();
    }
  }

  function revealCard() {
    scratchDone = true;
    canvas.style.opacity = '0';
    scratchHint.style.opacity = '0';
    setTimeout(() => { canvas.style.pointerEvents = 'none'; }, 600);
    launchConfetti();
  }

  function startScratch(e) {
    isScratching = true;
    scratchHint.style.opacity = '0';
    const { x, y } = getPos(e);
    scratchAt(x, y);
  }
  function moveScratch(e) {
    if (!isScratching) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    scratchAt(x, y);
    checkProgress();
  }
  function endScratch() {
    if (!isScratching) return;
    isScratching = false;
    if (!scratchDone) scratchHint.style.opacity = '0.85';
  }

  canvas.addEventListener('mousedown', startScratch);
  canvas.addEventListener('mousemove', moveScratch);
  window.addEventListener('mouseup', endScratch);
  canvas.addEventListener('touchstart', startScratch, { passive: true });
  canvas.addEventListener('touchmove', moveScratch, { passive: false });
  canvas.addEventListener('touchend', endScratch);

  /* ================= CONFETTI ================= */
  const confettiLayer = document.getElementById('confettiLayer');
  const CONFETTI_COLORS = ['#c23b53', '#b98b46', '#efc6c9', '#7a2035', '#fbf5ef'];

  function launchConfetti() {
    const count = 60;
    for (let i = 0; i < count; i++) {
      setTimeout(() => spawnConfetti(), i * 12);
    }
  }

  function spawnConfetti() {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const size = 6 + Math.random() * 8;
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const startX = 40 + Math.random() * 20; // originate near the card, center-ish
    const endX = startX + (Math.random() * 60 - 30);
    const rise = 30 + Math.random() * 20;
    const duration = 1.6 + Math.random() * 1.2;
    const rotate = Math.random() * 720 - 360;
    const round = Math.random() > 0.5;

    piece.style.left = startX + 'vw';
    piece.style.top = '55vh';
    piece.style.width = size + 'px';
    piece.style.height = round ? size + 'px' : size * 0.5 + 'px';
    piece.style.background = color;
    piece.style.borderRadius = round ? '50%' : '2px';

    confettiLayer.appendChild(piece);

    const anim = piece.animate([
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${(endX - startX)}vw, -${rise}vh) rotate(${rotate / 2}deg)`, opacity: 1, offset: 0.35 },
      { transform: `translate(${(endX - startX) * 1.4}vw, 60vh) rotate(${rotate}deg)`, opacity: 0 }
    ], { duration: duration * 1000, easing: 'cubic-bezier(.2,.6,.3,1)' });

    anim.onfinish = () => piece.remove();
  }

  /* ================= TOGGLES ================= */
  const mapToggle = document.getElementById('mapToggle');
  const calToggle = document.getElementById('calToggle');

  mapToggle.addEventListener('change', () => {
    if (mapToggle.checked) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.mapsQuery)}`;
      window.open(url, '_blank');
      setTimeout(() => { mapToggle.checked = false; }, 500);
    }
  });

  calToggle.addEventListener('change', () => {
    if (calToggle.checked) {
      const details = `Join us as we celebrate at ${EVENT.venueName}, ${EVENT.venueAddress}.`;
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent(EVENT.title)}` +
        `&dates=${EVENT.dateStart}/${EVENT.dateEnd}` +
        `&details=${encodeURIComponent(details)}` +
        `&location=${encodeURIComponent(EVENT.venueAddress)}`;
      window.open(url, '_blank');
      setTimeout(() => { calToggle.checked = false; }, 500);
    }
  });

  /* ================= MINI CALENDAR: NOVEMBER 2026 ================= */
  const calDays = document.getElementById('calDays');
  const NOV_2026_FIRST_WEEKDAY = 0; // Nov 1, 2026 is a Sunday (0 = Sun)
  const DAYS_IN_NOV = 30;
  const MARKED_DAY = 13;

  for (let i = 0; i < NOV_2026_FIRST_WEEKDAY; i++) {
    const empty = document.createElement('span');
    empty.className = 'cal-day empty';
    calDays.appendChild(empty);
  }

  for (let d = 1; d <= DAYS_IN_NOV; d++) {
    const cell = document.createElement('span');
    cell.className = 'cal-day';
    cell.textContent = d;
    if (d === MARKED_DAY) {
      cell.classList.add('marked');
      const heart = document.createElement('span');
      heart.className = 'heart-wrap';
      heart.innerHTML = `<svg viewBox="0 0 40 40">
        <path d="M20 32
                 C 8 24, 4 17, 7 12
                 C 10 7, 17 8, 20 14
                 C 23 7, 30 7, 33 12
                 C 36 18, 31 24, 20 32 Z"
              stroke-dasharray="1 0"/>
      </svg>`;
      cell.appendChild(heart);
    }
    calDays.appendChild(cell);
  }

});
