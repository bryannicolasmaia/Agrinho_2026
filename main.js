/**
 * AgroCarbon · Agrinho 2025
 * JavaScript Vanilla — sem frameworks
 */
 
// Aguarda o DOM estar completamente carregado antes de executar qualquer coisa
document.addEventListener('DOMContentLoaded', function () {
 
  /* ═══════════════════════════════════════════════════════════
     1. NAVEGAÇÃO
     ═══════════════════════════════════════════════════════════ */
 
  const header    = document.querySelector('.site-header');
  const navToggle = document.getElementById('navToggle');
  const siteNav   = document.getElementById('siteNav');
  const navLinks  = siteNav ? siteNav.querySelectorAll('a') : [];
 
  function handleHeaderScroll() {
    if (window.scrollY > 20) {
      header && header.classList.add('scrolled');
    } else {
      header && header.classList.remove('scrolled');
    }
  }
 
  function toggleMobileNav() {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  }
 
  function closeMobileNav() {
    siteNav && siteNav.classList.remove('open');
    navToggle && navToggle.setAttribute('aria-expanded', 'false');
    navToggle && navToggle.setAttribute('aria-label', 'Abrir menu');
  }
 
  document.addEventListener('click', function (e) {
    if (
      siteNav && siteNav.classList.contains('open') &&
      !siteNav.contains(e.target) &&
      navToggle && !navToggle.contains(e.target)
    ) {
      closeMobileNav();
    }
  });
 
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && siteNav && siteNav.classList.contains('open')) {
      closeMobileNav();
      navToggle && navToggle.focus();
    }
  });
 
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  navToggle && navToggle.addEventListener('click', toggleMobileNav);
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });
 
  handleHeaderScroll();
 
 
  /* ═══════════════════════════════════════════════════════════
     2. CARBON TICKER
     ═══════════════════════════════════════════════════════════ */
 
  var tickerEl = document.getElementById('tickerValue');
 
  if (tickerEl) {
    var DAILY_TARGET = 958904;
    var now = new Date();
    var secondsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    var dayFraction  = secondsToday / 86400;
    var currentValue = Math.floor(DAILY_TARGET * dayFraction);
 
    function animateToValue(start, end, duration) {
      var startTime = performance.now();
      function update(nowTime) {
        var elapsed  = nowTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        var value    = Math.floor(start + (end - start) * eased);
        tickerEl.textContent = value.toLocaleString('pt-BR');
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }
 
    animateToValue(0, currentValue, 2500);
 
    setTimeout(function () {
      setInterval(function () {
        currentValue += Math.floor(Math.random() * 3) + 1;
        tickerEl.textContent = currentValue.toLocaleString('pt-BR');
      }, 1100);
    }, 2600);
  }
 
 
  /* ═══════════════════════════════════════════════════════════
     3. ANIMAÇÕES DE ENTRADA
     ═══════════════════════════════════════════════════════════ */
 
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var animatables = document.querySelectorAll(
      '.stat-card, .flow-step, .practice-card, .tech-item, .callout, .section-header'
    );
 
    animatables.forEach(function (el, i) {
      el.classList.add('fade-in-up');
      var siblings = el.parentElement ? el.parentElement.children : [];
      var idx = Array.from(siblings).indexOf(el);
      el.style.transitionDelay = (idx * 60) + 'ms';
    });
 
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
 
      animatables.forEach(function (el) { observer.observe(el); });
    }
  }
 
 
  /* ═══════════════════════════════════════════════════════════
     4. QUIZ INTERATIVO
     ═══════════════════════════════════════════════════════════ */
 
  // Banco de perguntas
  var questions = [
    {
      text: 'O que é um "crédito de carbono" no contexto do agronegócio?',
      options: [
        'Um empréstimo bancário para compra de maquinário agrícola',
        'Um certificado que representa 1 tonelada de CO₂ não emitida ou capturada',
        'Um subsídio do governo para reduzir o uso de fertilizantes',
        'Uma pontuação de sustentabilidade dada pela Embrapa',
      ],
      correct: 1,
      feedback: '✅ Correto! Um crédito de carbono equivale a 1 tonelada de CO₂ que foi evitada ou removida da atmosfera. Esse crédito pode ser vendido a empresas que precisam compensar suas emissões.',
      wrongFeedback: '❌ Incorreto. Um crédito de carbono é um certificado que representa 1 tonelada de CO₂ que deixou de ser emitida ou foi capturada. Ele é negociado em mercados voluntários ou regulados.',
    },
    {
      text: 'No Sistema de Plantio Direto (SPD), qual é o principal benefício ambiental em relação ao carbono?',
      options: [
        'Aumenta a emissão de metano para fertilizar o solo naturalmente',
        'Elimina a necessidade de irrigação nos campos',
        'Evita o revolvimento do solo, impedindo que o carbono nele armazenado seja liberado para a atmosfera',
        'Permite o uso de mais defensivos químicos com menor impacto',
      ],
      correct: 2,
      feedback: '✅ Exato! Ao não arar o solo, o SPD preserva a matéria orgânica e o carbono estocado. O solo torna-se um reservatório de carbono em vez de uma fonte emissora.',
      wrongFeedback: '❌ Incorreto. O benefício climático do Plantio Direto é que, ao não revolver o solo, o carbono presente na matéria orgânica permanece preso ali.',
    },
    {
      text: 'O sistema ILPF é considerado uma inovação genuinamente brasileira. O que significa a sigla?',
      options: [
        'Irrigação, Lavoura, Produção e Fertilidade',
        'Integração Lavoura-Pecuária-Floresta',
        'Instituto de Licenciamento Para Fronteiras',
        'Índice de Lucro por Fazenda',
      ],
      correct: 1,
      feedback: '✅ Perfeito! ILPF = Integração Lavoura-Pecuária-Floresta. Grãos, gado e árvores convivem no mesmo espaço. As árvores absorvem o CO₂ do rebanho e geram renda com madeira futura.',
      wrongFeedback: '❌ ILPF significa Integração Lavoura-Pecuária-Floresta. É um modelo que combina cultivo de grãos, criação de animais e plantio de árvores na mesma área.',
    },
    {
      text: 'Qual tecnologia digital é usada para estimar com precisão quanto carbono uma propriedade rural está sequestrando?',
      options: [
        'Aplicativos de previsão do tempo agrícola',
        'Drones e imagens de satélite que calculam a biomassa da vegetação',
        'Sistemas de rastreamento de colheita via GPS',
        'Câmeras de segurança com IA para monitorar o gado',
      ],
      correct: 1,
      feedback: '✅ Correto! Drones e satélites mapeiam a saúde da vegetação. Com esses dados, algoritmos calculam a biomassa e quanto carbono aquela área está retendo — dado essencial para certificação.',
      wrongFeedback: '❌ A tecnologia correta são drones e imagens de satélite. Eles calculam a biomassa da vegetação para estimar o carbono sequestrado para fins de certificação.',
    },
    {
      text: 'Por que a substituição de fertilizantes nitrogenados sintéticos por Fixação Biológica de Nitrogênio (FBN) reduz as emissões de GEE?',
      options: [
        'Porque a FBN usa energia solar para funcionar, eliminando máquinas',
        'Porque fertilizantes nitrogenados sintéticos liberam óxido nitroso (N₂O), um GEE cerca de 300× mais potente que o CO₂',
        'Porque a FBN elimina totalmente a necessidade de colheita mecanizada',
        'Porque as bactérias da FBN produzem oxigênio puro no solo',
      ],
      correct: 1,
      feedback: '✅ Excelente! O N₂O liberado por fertilizantes nitrogenados tem potencial de aquecimento global cerca de 300 vezes maior que o CO₂. A FBN usa bactérias naturais, eliminando essa fonte de emissão.',
      wrongFeedback: '❌ A resposta correta envolve o N₂O. Fertilizantes nitrogenados liberam óxido nitroso, um gás de efeito estufa cerca de 300× mais potente que o CO₂.',
    },
  ];
 
  // Estado
  var quizState = {
    current:  0,
    score:    0,
    answered: false
  };
 
  // Elementos do DOM
  var screenStart    = document.getElementById('quizStart');
  var screenQuestion = document.getElementById('quizQuestion');
  var screenResult   = document.getElementById('quizResult');
 
  var elProgressFill  = document.getElementById('progressFill');
  var elProgressText  = document.getElementById('progressText');
  var elQuestionText  = document.getElementById('questionText');
  var elOptionsList   = document.getElementById('optionsList');
  var elFeedback      = document.getElementById('quizFeedback');
  var elNextBtn       = document.getElementById('nextBtn');
  var elStartBtn      = document.getElementById('startQuizBtn');
  var elRetryBtn      = document.getElementById('retryBtn');
  var elScoreArc      = document.getElementById('scoreArc');
  var elScoreLabel    = document.getElementById('scoreLabel');
  var elResultTitle   = document.getElementById('resultTitle');
  var elResultMessage = document.getElementById('resultMessage');
 
  // Verifica se os elementos existem antes de continuar
  if (!elStartBtn) {
    console.warn('Quiz: elemento startQuizBtn não encontrado.');
    return;
  }
 
  function showScreen(name) {
    var screens = { start: screenStart, question: screenQuestion, result: screenResult };
    Object.keys(screens).forEach(function (key) {
      var el = screens[key];
      if (!el) return;
      if (key === name) {
        el.classList.remove('quiz-screen--hidden');
      } else {
        el.classList.add('quiz-screen--hidden');
      }
    });
  }
 
  function renderQuestion(idx) {
    var q = questions[idx];
    quizState.answered = false;
 
    // Progresso
    var pct = (idx / questions.length) * 100;
    if (elProgressFill) elProgressFill.style.width = pct + '%';
    if (elProgressText) elProgressText.textContent = 'Pergunta ' + (idx + 1) + ' de ' + questions.length;
 
    // Texto da pergunta
    if (elQuestionText) elQuestionText.textContent = q.text;
 
    // Opções
    if (elOptionsList) {
      elOptionsList.innerHTML = '';
      var letters = ['A', 'B', 'C', 'D'];
 
      q.options.forEach(function (optText, i) {
        var li  = document.createElement('li');
        var btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.dataset.index = String(i);
        btn.innerHTML =
          '<span class="option-marker" aria-hidden="true">' + letters[i] + '</span>' +
          '<span>' + optText + '</span>';
 
        btn.addEventListener('click', function () {
          handleAnswer(i);
        });
 
        li.appendChild(btn);
        elOptionsList.appendChild(li);
      });
    }
 
    // Reseta feedback e botão
    if (elFeedback) {
      elFeedback.className = 'quiz-feedback';
      elFeedback.textContent = '';
    }
    if (elNextBtn) elNextBtn.style.display = 'none';
 
    showScreen('question');
  }
 
  function handleAnswer(chosenIdx) {
    if (quizState.answered) return;
    quizState.answered = true;
 
    var q = questions[quizState.current];
    var correct = (chosenIdx === q.correct);
 
    if (correct) quizState.score++;
 
    // Marca os botões
    var allBtns = elOptionsList ? elOptionsList.querySelectorAll('.option-btn') : [];
    allBtns.forEach(function (btn, i) {
      btn.disabled = true;
      if (i === q.correct) {
        btn.classList.add('correct');
        var marker = btn.querySelector('.option-marker');
        if (marker) marker.textContent = '✓';
      } else if (i === chosenIdx && !correct) {
        btn.classList.add('wrong');
        var marker = btn.querySelector('.option-marker');
        if (marker) marker.textContent = '✗';
      }
    });
 
    // Feedback
    if (elFeedback) {
      elFeedback.textContent = correct ? q.feedback : q.wrongFeedback;
      elFeedback.className = 'quiz-feedback visible ' + (correct ? 'feedback-correct' : 'feedback-wrong');
    }
 
    // Botão próxima
    if (elNextBtn) {
      elNextBtn.style.display = 'block';
      setTimeout(function () { elNextBtn.focus(); }, 80);
    }
  }
 
  function advanceQuiz() {
    quizState.current++;
    if (quizState.current < questions.length) {
      renderQuestion(quizState.current);
    } else {
      showResult();
    }
  }
 
  function showResult() {
    var total = questions.length;
    var score = quizState.score;
    var pct   = score / total;
 
    if (elProgressFill) elProgressFill.style.width = '100%';
    if (elScoreLabel)   elScoreLabel.textContent = score + '/' + total;
 
    // Arco SVG
    if (elScoreArc) {
      var circ   = 314;
      var offset = circ - circ * pct;
      setTimeout(function () {
        elScoreArc.style.transition = 'stroke-dashoffset 1s ease';
        elScoreArc.style.strokeDashoffset = String(offset);
      }, 120);
    }
 
    // Mensagem de resultado
    var title, msg;
    if (score === 5) {
      title = '🌳 Especialista em Campo Sustentável!';
      msg   = 'Incrível! Você domina os conceitos de descarbonização no agronegócio. Está pronto para fazer parte dessa revolução verde!';
    } else if (score === 4) {
      title = '🌿 Quase lá, futuro agrônomo!';
      msg   = 'Ótimo desempenho! Você já conhece bem o tema. Revise as questões que errou e repita o quiz!';
    } else if (score === 3) {
      title = '🌱 Bom começo, continue aprendendo!';
      msg   = 'Você está no caminho certo. Leia as seções sobre Mercado de Carbono e Práticas ABC+ para reforçar seu conhecimento.';
    } else {
      title = '🪴 O aprendizado está começando!';
      msg   = 'Não desanime! Explore todas as seções do site e tente o quiz novamente. Você vai melhorar!';
    }
 
    if (elResultTitle)   elResultTitle.textContent   = title;
    if (elResultMessage) elResultMessage.textContent = msg;
 
    showScreen('result');
  }
 
  function resetQuiz() {
    quizState = { current: 0, score: 0, answered: false };
    if (elProgressFill) elProgressFill.style.width = '0%';
    if (elScoreArc) {
      elScoreArc.style.transition = 'none';
      elScoreArc.style.strokeDashoffset = '314';
    }
    renderQuestion(0);
  }
 
  // Eventos dos botões
  elStartBtn.addEventListener('click', function () {
    renderQuestion(0);
  });
 
  elNextBtn && elNextBtn.addEventListener('click', advanceQuiz);
  elRetryBtn && elRetryBtn.addEventListener('click', resetQuiz);
 
}); // fim DOMContentLoaded
 