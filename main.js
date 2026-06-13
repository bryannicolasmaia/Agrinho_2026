/* ═══════════════════════════════════════
   Agrinho 2026 — script.js
   Funcionalidades: bolhas, contadores,
   reveal scroll, nav scroll spy, menu mobile
═══════════════════════════════════════ */
 
'use strict';
 
/* ─── 1. Bolhas de fundo no HERO ─── */
function createBubbles() {
  const container = document.getElementById('bubbles');
  if (!container) return;
 
  const count = 18;
 
  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.classList.add('bubble');
 
    const size    = 40 + Math.random() * 120;     // px
    const left    = Math.random() * 100;           // %
    const delay   = Math.random() * 18;            // s
    const duration = 14 + Math.random() * 16;     // s
 
    b.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -${size}px;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      opacity: 0;
    `;
 
    container.appendChild(b);
  }
}
 
/* ─── 2. Contadores animados no HERO ─── */
function animateCounter(el, target, suffix, duration) {
  const start     = performance.now();
  const isDecimal = String(target).includes('.');
 
  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const ease     = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current  = isDecimal
      ? (ease * target).toFixed(1)
      : Math.round(ease * target);
 
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
 
  requestAnimationFrame(step);
}
 
function initCounters() {
  const counters = [
    { id: 'cnt1', target: 120,  suffix: 'mi', duration: 2200 },
    { id: 'cnt2', target: 55,   suffix: '%',  duration: 1800 },
    { id: 'cnt3', target: 2050, suffix: '',   duration: 2600 },
  ];
 
  // Dispara quando o hero sai de view (ou imediatamente em tela pequena)
  const hero = document.getElementById('hero');
  let fired = false;
 
  function fire() {
    if (fired) return;
    fired = true;
    counters.forEach(c => {
      const el = document.getElementById(c.id);
      if (el) animateCounter(el, c.target, c.suffix, c.duration);
    });
  }
 
  // Pequeno delay para garantir que a animação seja visível na carga
  setTimeout(fire, 600);
}
 
/* ─── 3. Reveal ao rolar ─── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
 
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
 
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Pequeno stagger para cards em sequência
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  );
 
  els.forEach(el => observer.observe(el));
}
 
/* ─── 4. Nav: scroll spy + fundo sólido ─── */
function initNav() {
  const nav     = document.querySelector('nav');
  const links   = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
 
  if (!nav) return;
 
  // Fundo sólido ao rolar
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
 
  // Scroll spy — destaca o link da seção visível
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(a => {
            const href = a.getAttribute('href');
            a.classList.toggle('active', href === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.35 }
  );
 
  sections.forEach(s => spyObserver.observe(s));
 
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial
}
 
/* ─── 5. Menu mobile (hamburger) ─── */
function initMobileMenu() {
  const nav   = document.querySelector('nav');
  if (!nav) return;
 
  // Cria o botão dinamicamente para não precisar mudar o HTML
  const toggle = document.createElement('button');
  toggle.className    = 'nav-toggle';
  toggle.ariaLabel    = 'Abrir menu';
  toggle.innerHTML    = '<span></span><span></span><span></span>';
  nav.appendChild(toggle);
 
  const links = nav.querySelector('.nav-links');
 
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.ariaExpanded = open;
    toggle.ariaLabel    = open ? 'Fechar menu' : 'Abrir menu';
  });
 
  // Fecha ao clicar em um link
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.ariaExpanded = false;
    });
  });
 
  // Fecha ao clicar fora
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) {
      links.classList.remove('open');
      toggle.ariaExpanded = false;
    }
  });
}
 
/* ─── 6. Smooth scroll polyfill (links internos) ─── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector('nav')?.offsetHeight ?? 70;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
 
/* ─── 7. Stagger nos agro-cards ─── */
function initAgroStagger() {
  const cards = document.querySelectorAll('.agro-card.reveal');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });
}
 
/* ─── 8. Ticker de texto na timeline (opcional) ─── */
// Realça o item da timeline mais próximo ao scroll
function initTimelineHighlight() {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length) return;
 
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      e.target.style.opacity = e.isIntersecting ? '1' : '.55';
      e.target.style.transition = 'opacity .4s ease';
    });
  }, { threshold: 0.6 });
 
  items.forEach(i => obs.observe(i));
}
 
/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  createBubbles();
  initCounters();
  initReveal();
  initNav();
  initMobileMenu();
  initSmoothScroll();
  initAgroStagger();
  initTimelineHighlight();
});
 