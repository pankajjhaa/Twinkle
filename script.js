// ============================================
// Twinkle's Birthday Website — Interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initConfetti();
  initSparkleField();
  initScrollReveal();
  initDotNav();
  initGlowCursor();
  initSmileChips();
  initCakeCandles();
});

/* ---------- Confetti (warm palette) ---------- */
function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  const colors = ['#FFB347', '#FF7F50', '#FFDAB9', '#B76E79', '#FFA500', '#FF6347'];
  let particles = [];
  let running = true;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawn(count, originX, originY) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: originX !== undefined ? originX : Math.random() * canvas.width,
        y: originY !== undefined ? originY : -20 - Math.random() * 200,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * (originX !== undefined ? 6 : 2),
        vy: originX !== undefined ? -(4 + Math.random() * 5) : 1.5 + Math.random() * 2.2,
        gravity: 0.12,
        life: 0,
        maxLife: 260 + Math.random() * 120,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      });
    }
  }

  // Initial celebratory burst
  spawn(90);
  for (let i = 0; i < 40; i++) {
    setTimeout(() => spawn(3), i * 60);
  }

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.vy += p.gravity * 0.02;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      p.life++;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    particles = particles.filter(p => p.life < p.maxLife && p.y < canvas.height + 50);
    requestAnimationFrame(loop);
  }
  loop();

  // Expose a burst function for interactive elements
  window.__confettiBurst = (x, y, count = 40) => spawn(count, x, y);

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) loop();
  });
}

/* ---------- Floating sparkles in hero ---------- */
function initSparkleField() {
  const field = document.getElementById('sparkleField');
  if (!field) return;
  const count = window.innerWidth < 700 ? 18 : 34;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    const size = 2 + Math.random() * 4;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.left = `${Math.random() * 100}%`;
    s.style.bottom = `-${Math.random() * 20}px`;
    s.style.animationDuration = `${8 + Math.random() * 10}s`;
    s.style.animationDelay = `${Math.random() * 10}s`;
    field.appendChild(s);
  }
}

/* ---------- Scroll reveal for cards ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.tl-item, .gallery-frame, .trait-card, .wish-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(t => observer.observe(t));
}

/* ---------- Dot navigation active state ---------- */
function initDotNav() {
  const dots = document.querySelectorAll('.dot-nav .dot');
  if (!dots.length) return;
  const sections = Array.from(dots).map(d => document.querySelector(d.getAttribute('href')));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = sections.indexOf(entry.target);
        if (idx === -1) return;
        dots.forEach(d => d.classList.remove('active'));
        dots[idx].classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => s && observer.observe(s));
}

/* ---------- Glow cursor follow (desktop) ---------- */
function initGlowCursor() {
  const glow = document.getElementById('glowCursor');
  if (!glow) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  let active = false;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!active) {
      active = true;
      glow.style.opacity = '1';
    }
  });

  function animate() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  }
  animate();
}

/* ---------- "Things that make you smile" chips ---------- */
function initSmileChips() {
  const chips = document.querySelectorAll('.smile-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const rect = chip.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      if (window.__confettiBurst) window.__confettiBurst(x, y, 26);
      chip.style.transform = 'scale(0.95)';
      setTimeout(() => { chip.style.transform = ''; }, 150);
    });
  });
}

/* ---------- Cake candles: click to "blow out" + wish burst ---------- */
function initCakeCandles() {
  const btn = document.getElementById('blowCandles');
  const flames = document.getElementById('candleFlames');
  if (!btn || !flames) return;

  let blown = false;
  btn.addEventListener('click', () => {
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    if (!blown) {
      flames.classList.add('blown');
      if (window.__confettiBurst) window.__confettiBurst(x, y, 70);
      blown = true;
      setTimeout(() => {
        flames.classList.remove('blown');
        blown = false;
      }, 2200);
    } else {
      if (window.__confettiBurst) window.__confettiBurst(x, y, 30);
    }
  });
}
