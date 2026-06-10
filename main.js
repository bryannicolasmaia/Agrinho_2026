/* =====================================================
   AGRINHO 2025 — script.js  (versão corrigida)
   ===================================================== */
 
// ─── ESTADO DA PESQUISA ────────────────────────────────
var currentBlock = 1;
 
// ─── NAV SCROLL ────────────────────────────────────────
window.addEventListener('scroll', function () {
  var nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});
 
// ─── HAMBURGER ─────────────────────────────────────────
window.addEventListener('DOMContentLoaded', function () {
 
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
      });
    });
  }
 
  // ─── RADIO / CHECKBOX ESTILO ─────────────────────────
  document.querySelectorAll('.qopt').forEach(function (opt) {
    opt.addEventListener('click', function (e) {
      var input = opt.querySelector('input');
      if (!input) return;
 
      if (input.type === 'radio') {
        // Desmarca todos do mesmo grupo
        document.querySelectorAll('input[name="' + input.name + '"]').forEach(function (inp) {
          var parent = inp.closest('.qopt');
          if (parent) parent.classList.remove('selected');
        });
        opt.classList.add('selected');
        input.checked = true;
 
        // Reveal Q9
        if (input.name === 'q9') {
          var reveal = document.getElementById('reveal9');
          if (reveal) reveal.classList.toggle('show', input.value === 'b');
        }
 
      } else {
        // Checkbox — só inverte se o clique NÃO veio direto do input
        if (e.target !== input) {
          input.checked = !input.checked;
        }
        opt.classList.toggle('selected', input.checked);
 
        // Limites
        var maxMap = { q3: 2, q11: 3 };
        var limit = maxMap[input.name];
        if (limit) {
          var checked = document.querySelectorAll('input[name="' + input.name + '"]:checked');
          if (checked.length > limit) {
            input.checked = false;
            opt.classList.remove('selected');
            showToast('Selecione no máximo ' + limit + ' opções.');
          }
        }
      }
    });
  });
 
  // ─── SMOOTH SCROLL LINKS ─────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
 
  // ─── SCROLL REVEAL ───────────────────────────────────
  var revealTargets = document.querySelectorAll(
    '.info-card, .practice-card, .fonte-card, .cs-item, .sobre-text, .sobre-cards, .carbono-text, .carbono-visual'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });
 
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
 
    // Barras de progresso dos cards
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var fill = entry.target.querySelector('.pc-fill');
          if (fill) {
            var pct = fill.getAttribute('data-pct') || '0%';
            setTimeout(function () { fill.style.width = pct; }, 200);
          }
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
 
    document.querySelectorAll('.practice-card').forEach(function (card) {
      var fill = card.querySelector('.pc-fill');
      if (fill) {
        // Move o valor de --pct para data-pct e zera a largura inicial
        var style = fill.getAttribute('style') || '';
        var match = style.match(/--pct:\s*([^;]+)/);
        if (match) {
          fill.setAttribute('data-pct', match[1].trim());
          fill.style.width = '0%';
        }
        barObserver.observe(card);
      }
    });
 
    // Contador hero
    var heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.hstat-num').forEach(function (num) {
              var text = num.textContent;
              var hasPlus = text.indexOf('+') !== -1;
              var value = parseFloat(text.replace(/[^0-9.]/g, ''));
              var suffix = hasPlus ? '+' : (text.indexOf('%') !== -1 ? '%' : '');
              if (!isNaN(value)) animateCounter(num, value, suffix);
            });
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counterObserver.observe(heroStats);
    }
  }
 
  // Stagger delay
  document.querySelectorAll('.practices-grid .practice-card').forEach(function (card, i) {
    card.style.transitionDelay = (i * 0.08) + 's';
  });
  document.querySelectorAll('.fontes-grid .fonte-card').forEach(function (card, i) {
    card.style.transitionDelay = (i * 0.06) + 's';
  });
 
  // Estado inicial dos dots
  updateProgressDots(1);
});
 
// ─── LIKERT ────────────────────────────────────────────
function pickLikert(groupId, value) {
  var group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll('.lk-btn').forEach(function (btn, i) {
    btn.classList.toggle('selected', i + 1 === value);
  });
  group.dataset.value = value;
}
 
// ─── NAVEGAÇÃO DOS BLOCOS ──────────────────────────────
function goBlock(n) {
  var current = document.getElementById('block' + currentBlock);
  if (current) current.classList.add('hidden');
 
  var next = document.getElementById('block' + n);
  if (next) {
    next.classList.remove('hidden');
    setTimeout(function () {
      next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
 
  currentBlock = n;
  updateProgress(n);
  updateProgressDots(n);
}
 
function updateProgress(blockNum) {
  var bar   = document.getElementById('surveyBar');
  var label = document.getElementById('spLabel');
  var pct   = document.getElementById('spPct');
  var map   = { 1: 25, 2: 50, 3: 75, 4: 100 };
  var p     = map[blockNum] || 25;
  if (bar)   bar.style.width     = p + '%';
  if (label) label.textContent   = 'Bloco ' + blockNum + ' de 4';
  if (pct)   pct.textContent     = p + '%';
}
 
function updateProgressDots(activeBlock) {
  document.querySelectorAll('.sp-block').forEach(function (dot) {
    var bn = parseInt(dot.dataset.block);
    dot.classList.remove('active', 'done');
    if (bn === activeBlock) dot.classList.add('active');
    else if (bn < activeBlock) dot.classList.add('done');
  });
}
 
function submitSurvey() {
  var b4 = document.getElementById('block4');
  if (b4) b4.classList.add('hidden');
 
  var thanks = document.getElementById('blockThanks');
  if (thanks) {
    thanks.classList.remove('hidden');
    setTimeout(function () {
      thanks.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
 
  var bar   = document.getElementById('surveyBar');
  var label = document.getElementById('spLabel');
  var pct   = document.getElementById('spPct');
  if (bar)   bar.style.width   = '100%';
  if (label) label.textContent = 'Concluído!';
  if (pct)   pct.textContent   = '100%';
 
  document.querySelectorAll('.sp-block').forEach(function (dot) {
    dot.classList.remove('active');
    dot.classList.add('done');
  });
 
  showToast('✅ Pesquisa enviada! Obrigado pela participação.');
}
 
// ─── COMPARTILHAR ──────────────────────────────────────
function shareWhatsApp() {
  var text = encodeURIComponent('Participei da pesquisa do projeto Agrinho! Responda também: ' + window.location.href);
  window.open('https://wa.me/?text=' + text, '_blank');
}
 
function shareGeneral() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).then(function () {
      showToast('🔗 Link copiado com sucesso!');
    });
  } else {
    showToast('Copie o link da barra de endereço.');
  }
}
 
// ─── TOAST ─────────────────────────────────────────────
var toastTimer;
function showToast(msg) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 3200);
}
 
// ─── CONTADOR ANIMADO ──────────────────────────────────
function animateCounter(el, target, suffix) {
  var duration = 1600;
  var steps    = 50;
  var increment = target / steps;
  var current  = 0;
  var step     = 0;
  var timer = setInterval(function () {
    step++;
    current += increment;
    if (step >= steps) { current = target; clearInterval(timer); }
    el.textContent = Math.round(current) + suffix;
  }, duration / steps);
}