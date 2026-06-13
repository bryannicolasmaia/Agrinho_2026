/* ============================================================
   AGRINHO 2025 — script.js  (completo e corrigido)
   ============================================================ */

var currentBlock = 1;
var toastTimer;

/* ── NAV SCROLL ──────────────────────────────────────────── */
window.addEventListener('scroll', function () {
  var nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── LIKERT ──────────────────────────────────────────────── */
function pickLikert(groupId, value) {
  var group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll('.lk-btn').forEach(function (btn, i) {
    btn.classList.toggle('selected', i + 1 === value);
  });
}

/* ── NAVEGAÇÃO DOS BLOCOS ────────────────────────────────── */
function goBlock(n) {
  var current = document.getElementById('block' + currentBlock);
  if (current) current.classList.add('hidden');

  var next = document.getElementById('block' + n);
  if (next) {
    next.classList.remove('hidden');
    setTimeout(function () {
      var top = next.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }, 30);
  }

  currentBlock = n;

  var pcts = { 1: 25, 2: 50, 3: 75, 4: 100 };
  var p = pcts[n] || 25;
  var bar = document.getElementById('surveyBar');
  var lbl = document.getElementById('spLabel');
  var pct = document.getElementById('spPct');
  if (bar) bar.style.width = p + '%';
  if (lbl) lbl.textContent = 'Bloco ' + n + ' de 4';
  if (pct) pct.textContent = p + '%';

  document.querySelectorAll('.sp-step').forEach(function (dot) {
    var bn = parseInt(dot.getAttribute('data-block'));
    dot.classList.remove('active', 'done');
    if (bn === n) dot.classList.add('active');
    else if (bn < n) dot.classList.add('done');
  });
}

/* ── ENVIAR ──────────────────────────────────────────────── */
function submitSurvey() {
  var b4 = document.getElementById('block4');
  if (b4) b4.classList.add('hidden');

  var thanks = document.getElementById('blockThanks');
  if (thanks) {
    thanks.classList.remove('hidden');
    setTimeout(function () {
      var top = thanks.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }, 30);
  }

  var bar = document.getElementById('surveyBar');
  var lbl = document.getElementById('spLabel');
  var pct = document.getElementById('spPct');
  if (bar) bar.style.width = '100%';
  if (lbl) lbl.textContent = 'Concluído!';
  if (pct) pct.textContent = '100%';

  document.querySelectorAll('.sp-step').forEach(function (dot) {
    dot.classList.remove('active');
    dot.classList.add('done');
  });

  showToast('✅ Pesquisa enviada! Obrigado pela participação.');
}

/* ── COMPARTILHAR ────────────────────────────────────────── */
function shareWhatsApp() {
  var text = encodeURIComponent('Participei da pesquisa do projeto Agrinho sobre o agro e o futuro sustentável! Responda também: ' + window.location.href);
  window.open('https://wa.me/?text=' + text, '_blank');
}

function shareLink() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).then(function () {
      showToast('🔗 Link copiado!');
    });
  } else {
    showToast('Copie o link da barra de endereço.');
  }
}

/* ── TOAST ───────────────────────────────────────────────── */
function showToast(msg) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3000);
}

/* ── TUDO NO DOM PRONTO ──────────────────────────────────── */
window.addEventListener('DOMContentLoaded', function () {

  /* Hamburger */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobileMenu.classList.remove('open'); });
    });
  }

  /* Radio / Checkbox */
  document.querySelectorAll('.qopt').forEach(function (opt) {
    opt.addEventListener('click', function (e) {
      var input = opt.querySelector('input');
      if (!input) return;

      if (input.type === 'radio') {
        document.querySelectorAll('input[name="' + input.name + '"]').forEach(function (inp) {
          var p = inp.closest('.qopt');
          if (p) p.classList.remove('selected');
        });
        input.checked = true;
        opt.classList.add('selected');

      } else {
        if (e.target !== input) input.checked = !input.checked;
        opt.classList.toggle('selected', input.checked);

        var limits = { q4: 2, q13: 3 };
        var limit = limits[input.name];
        if (limit) {
          var total = document.querySelectorAll('input[name="' + input.name + '"]:checked').length;
          if (total > limit) {
            input.checked = false;
            opt.classList.remove('selected');
            showToast('Selecione no máximo ' + limit + ' opções.');
          }
        }
      }
    });
  });

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
      }
    });
  });

  /* IntersectionObserver para reveal e barras */
  if ('IntersectionObserver' in window) {

    /* Reveal geral */
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) { revObs.observe(el); });

    /* Barras de prática */
    var barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var fill = entry.target.querySelector('.pc-fill');
          if (fill) {
            var pct = fill.getAttribute('data-pct') || '0';
            setTimeout(function () { fill.style.width = pct + '%'; }, 200);
          }
          barObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.practice-card').forEach(function (card) { barObs.observe(card); });

    /* Contador hero */
    var heroBar = document.querySelector('.hero-stats-bar');
    if (heroBar) {
      var countObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.hstat-num').forEach(function (el) {
              var target = parseInt(el.getAttribute('data-target')) || 0;
              var suf = el.nextElementSibling ? el.nextElementSibling.textContent : '';
              var steps = 50; var step = 0;
              var timer = setInterval(function () {
                step++;
                el.textContent = Math.round(target * step / steps);
                if (step >= steps) clearInterval(timer);
              }, 1600 / steps);
            });
            countObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      countObs.observe(heroBar);
    }
  }

  /* Stagger cards */
  document.querySelectorAll('.practices-grid .practice-card').forEach(function (c, i) {
    c.style.transitionDelay = (i * 0.08) + 's';
  });
  document.querySelectorAll('.fontes-grid .fcard').forEach(function (c, i) {
    c.style.transitionDelay = (i * 0.06) + 's';
  });

  /* Dots iniciais */
  document.querySelectorAll('.sp-step').forEach(function (dot) {
    if (parseInt(dot.getAttribute('data-block')) === 1) dot.classList.add('active');
  });
});