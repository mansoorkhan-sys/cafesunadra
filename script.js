/* ═══════════════════════════════════════════
   CAFE SUNDARA — SCRIPT.JS
   GSAP + Lenis + Particles + Cursor
═══════════════════════════════════════════ */

'use strict';

/* ─── GSAP REGISTER ─────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ─── LENIS SMOOTH SCROLL ───────────────── */
const lenis = new Lenis({
  lerp: 0.08,
  wheelmultiplier: 1.1,
  smoothTouch: false,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ─── SCROLL PROGRESS BAR ───────────────── */
const scrollBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = pct + '%';
}, { passive: true });

/* ─── CUSTOM CURSOR ─────────────────────── */
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  gsap.to(cursor, { x: mx, y: my, duration: 0.12, ease: 'power2.out' });
  gsap.to(trail,  { x: mx, y: my, duration: 0.35, ease: 'power2.out' });
});

document.querySelectorAll('a, button, .char-card, .menu-card, .gallery-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursor, { width: 36, height: 36, borderColor: '#ff6b00', duration: .2 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursor, { width: 16, height: 16, borderColor: '#00bfff', duration: .2 });
  });
});

/* ─── PRELOADER ─────────────────────────── */
const preloader   = document.getElementById('preloader');
const chargeFill  = document.getElementById('chargeFill');
const chargeLabel = document.getElementById('chargePercent');

let progress = 0;
const chargeInterval = setInterval(() => {
  progress += Math.random() * 4 + 1;
  if (progress >= 100) {
    progress = 100;
    clearInterval(chargeInterval);
    setTimeout(hidePreloader, 400);
  }
  chargeFill.style.width = progress + '%';
  chargeLabel.textContent = Math.floor(progress) + '%';
}, 40);

function hidePreloader() {
  gsap.to(preloader, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.inOut',
    onComplete: () => {
      preloader.style.display = 'none';
      initAnimations();
    }
  });
}

/* ─── HERO CANVAS PARTICLES ─────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = ['#00bfff','#ff6b00','#e8282a','#f5a623','#9b59b6'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2 + .5;
      this.clr = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * .4 + .1;
      this.vx = (Math.random() - .5) * .4;
      this.vy = (Math.random() - .5) * .4;
      this.life = Math.random() * 200 + 100;
      this.age = 0;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.age++;
      if (this.age > this.life || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha * (1 - this.age / this.life);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.clr;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.clr;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 180; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    // Draw connecting lines
    particles.forEach((p, i) => {
      particles.slice(i + 1, i + 5).forEach(q => {
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 80) * 0.08;
          ctx.strokeStyle = p.clr;
          ctx.lineWidth = .5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
          ctx.restore();
        }
      });
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ─── SPEED LINES ───────────────────────── */
function initSpeedLines() {
  const container = document.getElementById('speedLines');
  for (let i = 0; i < 20; i++) {
    const line = document.createElement('div');
    line.className = 'speed-line';
    const top = Math.random() * 100;
    const width = Math.random() * 30 + 10;
    const delay = Math.random() * 5;
    line.style.cssText = `top:${top}%;left:0;width:${width}%;transform:rotate(${(Math.random()-0.5)*3}deg);`;
    gsap.fromTo(line, 
      { x: '-110%', opacity: 0 },
      { x: '110%', opacity: 1, duration: Math.random() * 3 + 2, delay, repeat: -1, ease: 'none' }
    );
    container.appendChild(line);
  }
}

/* ─── HERO PARALLAX ─────────────────────── */
function initHeroParallax() {
  const chars = document.querySelectorAll('.char-float');
  document.addEventListener('mousemove', (e) => {
    const cx = (e.clientX / window.innerWidth  - .5) * 2;
    const cy = (e.clientY / window.innerHeight - .5) * 2;
    chars.forEach(el => {
      const depth = parseFloat(el.dataset.depth || .2);
      gsap.to(el, { x: cx * 30 * depth, y: cy * 20 * depth, duration: 1, ease: 'power2.out' });
    });
  });
}

/* ─── HERO ENTRY ANIMATION ──────────────── */
function heroEntry() {
  const tl = gsap.timeline();
  tl.from('.hero-eyebrow',   { opacity: 0, y: 20, duration: .8, ease: 'power3.out' })
    .from('.t1',             { opacity: 0, x: -80, duration: .8, ease: 'power4.out' }, '-=.4')
    .from('.t2',             { opacity: 0, x:  80, duration: .8, ease: 'power4.out' }, '-=.6')
    .from('.title-sub',      { opacity: 0, y: 20, duration: .6, ease: 'power3.out' }, '-=.3')
    .from('.hero-desc',      { opacity: 0, y: 20, duration: .6, ease: 'power3.out' }, '-=.2')
    .from('#heroCta',        { opacity: 0, y: 20, duration: .6, ease: 'power3.out' }, '-=.2')
    .from('#scrollIndicator',{ opacity: 0, y: 10, duration: .6, ease: 'power3.out' }, '-=.1')
    .from('.char-float',     { opacity: 0, y: 60, stagger: .15, duration: 1, ease: 'power4.out' }, '-=.8');
}

/* ─── FLOAT ANIMATION ───────────────────── */
function initFloatAnims() {
  document.querySelectorAll('.char-float').forEach((el, i) => {
    gsap.to(el, {
      y: '+=15',
      duration: 2.5 + i * .3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  });
}

/* ─── NAVBAR SCROLL ─────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  lenis.on('scroll', ({ scroll }) => {
    nav.classList.toggle('scrolled', scroll > 80);
  });

  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ─── SCROLL TRIGGER ANIMATIONS ─────────── */
function initScrollAnimations() {

  /* --- Section headers reveal --- */
  gsap.utils.toArray('[data-anim="reveal"]').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 0, y: 50, duration: .9, ease: 'power3.out',
    });
  });

  /* --- About slide in --- */
  gsap.from('[data-anim="slide-right"]', {
    scrollTrigger: { trigger: '.about-grid', start: 'top 80%' },
    opacity: 0, x: -60, duration: .9, ease: 'power3.out',
  });
  gsap.from('[data-anim="slide-left"]', {
    scrollTrigger: { trigger: '.about-grid', start: 'top 80%' },
    opacity: 0, x: 60, duration: .9, ease: 'power3.out', delay: .15,
  });

  /* --- Stat pop --- */
  gsap.utils.toArray('[data-anim="pop"]').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      opacity: 0, scale: .7, duration: .6, ease: 'back.out(2)', delay: i * .1,
    });
  });

  /* --- Character cards stagger --- */
  gsap.from('[data-anim="char-card"]', {
    scrollTrigger: { trigger: '#charsGrid', start: 'top 80%' },
    opacity: 0, y: 80, stagger: .12, duration: .8, ease: 'power4.out',
  });

  /* --- Menu cards stagger --- */
  gsap.from('[data-anim="menu-card"]', {
    scrollTrigger: { trigger: '#menuGrid', start: 'top 80%' },
    opacity: 0, y: 60, stagger: .1, duration: .7, ease: 'power3.out',
  });

  /* --- Gallery stagger --- */
  gsap.from('[data-anim="gallery-item"]', {
    scrollTrigger: { trigger: '#galleryGrid', start: 'top 80%' },
    opacity: 0, scale: .9, stagger: .08, duration: .7, ease: 'power3.out',
  });

  /* --- Contact sections --- */
  gsap.from('.contact-info', {
    scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
    opacity: 0, x: -50, duration: .8, ease: 'power3.out',
  });
  gsap.from('.contact-form-wrap', {
    scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
    opacity: 0, x: 50, duration: .8, ease: 'power3.out', delay: .15,
  });

  /* --- About parallax background glow --- */
  gsap.to('.about-glow', {
    scrollTrigger: { trigger: '.about', scrub: 2 },
    y: -100, x: 60,
  });
  gsap.to('.chars-glow', {
    scrollTrigger: { trigger: '.characters', scrub: 2 },
    y: -80, x: -40,
  });

  /* --- Footer line animation --- */
  const footerLine = document.getElementById('footerLine');
  ScrollTrigger.create({
    trigger: '.footer',
    start: 'top 90%',
    onEnter: () => {
      gsap.to(footerLine, { left: '0%', duration: 1.5, ease: 'power3.out' });
    }
  });

  /* --- Power bars animate on scroll --- */
  document.querySelectorAll('.power-fill').forEach(bar => {
    const target = bar.style.width;
    bar.style.width = '0%';
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(bar, { width: target, duration: 1.2, ease: 'power2.out', delay: .3 });
      }
    });
  });
}

/* ─── 3D TILT ON MENU CARDS ─────────────── */
function initMenuTilt() {
  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - .5) * 14;
      const y = ((e.clientY - rect.top)  / rect.height - .5) * 14;
      gsap.to(card, {
        rotateX: -y, rotateY: x,
        transformPerspective: 800,
        duration: .4, ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: .6, ease: 'elastic.out(1,.5)' });
    });
  });
}

/* ─── GALLERY LIGHTBOX ──────────────────── */
function initGallery() {
  const items     = document.querySelectorAll('.gallery-item');
  const lightbox  = document.getElementById('lightbox');
  const content   = document.getElementById('lightboxContent');
  const closeBtn  = document.getElementById('lightboxClose');
  const prevBtn   = document.getElementById('lightboxPrev');
  const nextBtn   = document.getElementById('lightboxNext');
  let current = 0;

  function open(idx) {
    current = idx;
    const item = items[idx];
    const ph   = item.querySelector('.gallery-placeholder');
    const cap  = item.querySelector('.gallery-caption').textContent;
    const k    = item.querySelector('.gallery-kanji').textContent;
    const style = ph.style.cssText;
    content.innerHTML = `
      <div class="gallery-placeholder" style="${style%; width:400px; height:300px; max-width:80vw; max-height:70vh;">
        <span class="gallery-kanji" style="font-size:7rem;">${k}</span>
        <span style="font-family:var(--font-tech);font-size:.7rem;letter-spacing:.2em;color:rgba(255,255,255,.4);">${cap}</span>
      </div>`;
    lightbox.classList.add('open');
    gsap.from(content, { opacity: 0, scale: .9, duration: .3, ease: 'power3.out' });
  }

  function close() {
    gsap.to(content, {
      opacity: 0, scale: .9, duration: .2,
      onComplete: () => lightbox.classList.remove('open'),
    });
  }

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => open((current - 1 + items.length) % items.length));
  nextBtn.addEventListener('click', () => open((current + 1) % items.length));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')    close();
    if (e.key === 'ArrowLeft') open((current - 1 + items.length) % items.length);
    if (e.key === 'ArrowRight')open((current + 1) % items.length);
  });
}

/* ─── CONTACT FORM ──────────────────────── */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const nameIn  = document.getElementById('formName');
  const emailIn = document.getElementById('formEmail');
  const msgIn   = document.getElementById('formMsg');
  const nameErr = document.getElementById('nameError');
  const emailErr= document.getElementById('emailError');
  const msgErr  = document.getElementById('msgError');

  function validate() {
    let ok = true;
    nameErr.textContent = emailErr.textContent = msgErr.textContent = '';
    nameIn.classList.remove('error');
    emailIn.classList.remove('error');
    msgIn.classList.remove('error');

    if (!nameIn.value.trim()) {
      nameErr.textContent = 'Enter your battle name'; nameIn.classList.add('error'); ok = false;
    }
    const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRE.test(emailIn.value.trim())) {
      emailErr.textContent = 'Enter a valid guild email'; emailIn.classList.add('error'); ok = false;
    }
    if (msgIn.value.trim().length < 10) {
      msgErr.textContent = 'Write at least 10 characters'; msgIn.classList.add('error'); ok = false;
    }
    return ok;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
    gsap.to(form, {
      opacity: 0, y: -20, duration: .4,
      onComplete: () => {
        form.style.display = 'none';
        success.classList.add('show');
        gsap.from(success, { opacity: 0, y: 20, duration: .5, ease: 'power3.out' });
      }
    });
  });

  // Inline field validation
  [nameIn, emailIn, msgIn].forEach(el => {
    el.addEventListener('input', () => el.classList.remove('error'));
  });
}

/* ─── NAVBAR ACTIVE LINK ────────────────── */
function initActiveSections() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: () => {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
      });
      links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }
  });
}

/* ─── SMOOTH ANCHOR LINKS ───────────────── */
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) lenis.scrollTo(target, { offset: -80, duration: 1.6 });
    });
  });
}

/* ─── CTA BUTTON ENERGY BURST ───────────── */
function initCTABurst() {
  document.querySelectorAll('.hero-cta').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const burst = document.createElement('span');
      burst.style.cssText = `
        position:absolute;
        left:${e.offsetX}px;top:${e.offsetY}px;
        width:0;height:0;
        background:rgba(255,107,0,.3);
        border-radius:50%;
        transform:translate(-50%,-50%);
        pointer-events:none;
      `;
      this.appendChild(burst);
      gsap.to(burst, {
        width: 200, height: 200, opacity: 0, duration: .6,
        ease: 'power2.out',
        onComplete: () => burst.remove(),
      });
    });
  });
}

/* ─── SECTION GLOW PULSE ────────────────── */
function initGlowPulse() {
  document.querySelectorAll('.section-bg-glow').forEach((el, i) => {
    gsap.to(el, {
      opacity: .18,
      scale: 1.05,
      duration: 3 + i,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  });
}

/* ─── MASTER INIT ───────────────────────── */
function initAnimations() {
  initHeroCanvas();
  initSpeedLines();
  initHeroParallax();
  heroEntry();
  initFloatAnims();
  initNavbar();
  initScrollAnimations();
  initMenuTilt();
  initGallery();
  initContactForm();
  initActiveSections();
  initSmoothLinks();
  initCTABurst();
  initGlowPulse();
}

/* ─── START ─────────────────────────────── */
// Fallback: if preloader takes too long, init anyway
setTimeout(() => {
  if (preloader && preloader.style.display !== 'none' &&
      getComputedStyle(preloader).opacity !== '0') {
    hidePreloader();
  }
}, 4500);
