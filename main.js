/* =====================================================
   AGRINHO 2025 — script.js
   Interatividade: Nav, Survey, Animações, Toast
   ===================================================== */
 
// ─── NAV SCROLL ────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});
 
// ─── HAMBURGER ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
 
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
 
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});
 
// ─── LIKERT SELECTION ──────────────────────────────────
function pickLikert(groupId, value) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll('.lk-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i + 1 === value);
  });
  group.dataset.value = value;
}
 
// ─── RADIO / CHECKBOX STYLE SYNC ───────────────────────
document.querySelectorAll('.qopt').forEach(opt => {
  const input = opt.querySelector('input');
  if (!input) return;
 
  opt.addEventListener('click', () => {
    if (input.type === 'radio') {
      // Deselect siblings
      const name = input.name;
      document.querySelectorAll(`input[name="${name}"]`).forEach(inp => {
        inp.closest('.qopt').classList.remove('selected');
      });
      opt.classList.add('selected');
      input.checked = true;
 
      // Q9 reveal
      if (name === 'q9') {
        const reveal = document.getElementById('reveal9');
        if (reveal) reveal.classList.toggle('show', input.value === 'b');
      }
    } else {
      // Checkbox
      input.checked = !input.checked;
      opt.classList.toggle('selected', input.checked);
 
      // Enforce max 2 for q3, max 3 for q11
      const maxMap = { q3: 2, q11: 3 };
      const limit = maxMap[input.name];
      if (limit) {
        const checked = document.querySelectorAll(`input[name="${input.name}"]:checked`);
        if (checked.length > limit) {
          input.checked = false;
          opt.classList.remove('selected');
          showToast(`Selecione no máximo ${limit} opções.`);
        }
      }
    }
  });
});
 
// ─── SURVEY NAVIGATION ─────────────────────────────────
let currentBlock = 1;
 
function goBlock(n) {
  // Hide current
  const current = document.getElementById('block' + currentBlock);
  if (current) {
    current.classList.add('hidden');
  }
 
  // Show next
  const next = document.getElementById('block' + n);
  if (next) {
    next.classList.remove('hidden');
    next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
 
  currentBlock = n;
  updateProgress(n);
  updateProgressDots(n);
}
 
function updateProgress(blockNum) {
  const bar = document.getElementById('surveyBar');
  const label = document.getElementById('spLabel');
  const pct = document.getElementById('spPct');
 
  const map = { 1: 25, 2: 50, 3: 75, 4: 100 };
  const p = map[blockNum] || 25;
 
  if (bar) bar.style.width = p + '%';
  if (label) label.textContent = 'Bloco ' + blockNum + ' de 4';
  if (pct) pct.textContent = p + '%';
}
 
function updateProgressDots(activeBlock) {
  document.querySelectorAll('.sp-block').forEach(dot => {
    const bn = parseInt(dot.dataset.block);
    dot.classList.remove('active', 'done');
    if (bn === activeBlock) dot.classList.add('active');
    else if (bn < activeBlock) dot.classList.add('done');
  });
}
 
function submitSurvey() {
  // Hide block 4
  const b4 = document.getElementById('block4');
  if (b4) b4.classList.add('hidden');
 
  // Show thanks
  const thanks = document.getElementById('blockThanks');
  if (thanks) {
    thanks.classList.remove('hidden');
    thanks.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
 
  // Update progress bar to complete
  const bar = document.getElementById('surveyBar');
  const label = document.getElementById('spLabel');
  const pct = document.getElementById('spPct');
  if (bar) bar.style.width = '100%';
  if (label) label.textContent = 'Concluído!';
  if (pct) pct.textContent = '100%';
 
  // Mark all dots done
  document.querySelectorAll('.sp-block').forEach(dot => {
    dot.classList.remove('active');
    dot.classList.add('done');
  });
 
  showToast('✅ Pesquisa enviada com sucesso! Obrigado.');
}
 
// ─── SHARE ─────────────────────────────────────────────
function shareWhatsApp() {
  const text = encodeURIComponent('Participei da pesquisa do projeto Agrinho sobre o agro e o futuro sustentável! Responda também: ' + window.location.href);
  window.open('https://wa.me/?text=' + text, '_blank');
}
 
function shareGeneral() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('🔗 Link copiado com sucesso!');
    });
  } else {
    showToast('Copie o link da barra de endereço.');
  }
}
 
// ─── TOAST ─────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}
 
// ─── SCROLL REVEAL ─────────────────────────────────────
function setupReveal() {
  const targets = document.querySelectorAll(
    '.info-card, .practice-card, .fonte-card, .cs-item, .sobre-text, .sobre-cards, .carbono-text, .carbono-visual'
  );
 
  targets.forEach(el => el.classList.add('reveal'));
 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
 
  targets.forEach(el => observer.observe(el));
}
 
// ─── STAGGER CARDS ─────────────────────────────────────
function staggerCards() {
  document.querySelectorAll('.practices-grid .practice-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
  });
  document.querySelectorAll('.fontes-grid .fonte-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.06) + 's';
  });
  document.querySelectorAll('.sobre-cards .info-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
  });
}
 
// ─── SMOOTH NAV LINK SCROLL ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
 
// ─── ANIMATED COUNTERS IN HERO STATS ───────────────────
function animateCounter(el, target, suffix) {
  const isFloat = target % 1 !== 0;
  const duration = 1800;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;
 
  const timer = setInterval(() => {
    step++;
    current += increment;
    if (step >= steps) {
      current = target;
      clearInterval(timer);
    }
    const display = isFloat ? current.toFixed(0) : Math.round(current);
    el.textContent = display + suffix;
  }, duration / steps);
}
 
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.hstat-num');
        nums.forEach(num => {
          const text = num.textContent;
          const hasPlus = text.includes('+');
          const value = parseFloat(text.replace(/[^0-9.]/g, ''));
          const suffix = hasPlus ? '+' : (text.includes('%') ? '%' : '');
          if (!isNaN(value)) {
            num.textContent = '0' + suffix;
            animateCounter(num, value, suffix);
          }
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
 
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);
}
 
// ─── PROGRESS BAR ANIMATION ────────────────────────────
function animatePracticeBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.pc-fill').forEach(fill => {
          fill.style.width = fill.style.getPropertyValue('--pct') || getComputedStyle(fill).getPropertyValue('--pct');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
 
  document.querySelectorAll('.practice-card').forEach(card => {
    const fill = card.querySelector('.pc-fill');
    if (fill) {
      const pct = fill.style.cssText.match(/--pct:\s*([^;]+)/)?.[1] || '0%';
      fill.style.setProperty('--pct', pct);
      fill.style.width = '0%';
      observer.observe(card);
    }
  });
}
 
// ─── INIT ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupReveal();
  staggerCards();
  initCounters();
  animatePracticeBars();
  updateProgressDots(1);
 
  // Re-trigger bar animations on section enter
  const practiceBarsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.pc-fill').forEach(fill => {
          const pct = fill.style.cssText.match(/--pct:\s*([^;]+)/)?.[1];
          if (pct) {
            setTimeout(() => { fill.style.width = pct; }, 200);
          }
        });
        practiceBarsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
 
  document.querySelectorAll('.practice-card').forEach(c => practiceBarsObserver.observe(c));
});