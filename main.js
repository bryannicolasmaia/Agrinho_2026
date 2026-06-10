/**
 * AgroCarbon · Agrinho 2025
 * JavaScript Vanilla — sem frameworks
 * ─────────────────────────────────────
 * Módulos:
 *  1. Navegação (sticky header, menu mobile, scroll ativo)
 *  2. Carbon Ticker (animação do contador hero)
 *  3. Animações de entrada (Intersection Observer)
 *  4. Quiz Interativo
 */
 
/* ═══════════════════════════════════════════════════════════
   1. NAVEGAÇÃO
   ═══════════════════════════════════════════════════════════ */
 
const header     = document.getElementById('top')?.closest('header') || document.querySelector('.site-header');
const navToggle  = document.getElementById('navToggle');
const siteNav    = document.getElementById('siteNav');
const navLinks   = siteNav?.querySelectorAll('a');
 
/**
 * Adiciona classe "scrolled" ao header quando a página é rolada,
 * ativando o efeito de sombra.
 */
function handleHeaderScroll() {
  if (window.scrollY > 20) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
}
 
/**
 * Abre/fecha o menu mobile acessível.
 */
function toggleMobileNav() {
  const isOpen = siteNav?.classList.toggle('open');
  navToggle?.setAttribute('aria-expanded', String(isOpen));
  navToggle?.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
}
 
/**
 * Fecha o menu mobile ao clicar em qualquer link de navegação.
 */
function closeMobileNav() {
  siteNav?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Abrir menu');
}
 
// Fecha o menu ao clicar fora dele
document.addEventListener('click', (e) => {
  if (
    siteNav?.classList.contains('open') &&
    !siteNav.contains(e.target) &&
    !navToggle?.contains(e.target)
  ) {
    closeMobileNav();
  }
});
 
// Fecha o menu ao pressionar Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && siteNav?.classList.contains('open')) {
    closeMobileNav();
    navToggle?.focus();
  }
});
 
// Registra listeners
window.addEventListener('scroll', handleHeaderScroll, { passive: true });
navToggle?.addEventListener('click', toggleMobileNav);
navLinks?.forEach(link => link.addEventListener('click', closeMobileNav));
 
// Executa uma vez na carga
handleHeaderScroll();
 
 
/* ═══════════════════════════════════════════════════════════
   2. CARBON TICKER
   Simula a contagem de CO₂ sequestrado hoje pelo agro BR.
   Baseado em estimativa: ~350 milhões t/ano ÷ 365 dias.
   ═══════════════════════════════════════════════════════════ */
 
(function initCarbonTicker() {
  const tickerEl = document.getElementById('tickerValue');
  if (!tickerEl) return;
 
  // Estimativa diária (toneladas): 350.000.000 / 365 ≈ 958.904 t/dia
  // Simulamos o acúmulo proporcional desde a meia-noite de hoje.
  const DAILY_TARGET = 958904;
 
  // Calcula quanto do dia já passou (0.0 – 1.0)
  const now = new Date();
  const secondsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const dayFraction  = secondsToday / 86400;
 
  let currentValue = Math.floor(DAILY_TARGET * dayFraction);
  const targetValue = Math.floor(DAILY_TARGET * Math.min(dayFraction + 0.001, 1)); // pequeno look-ahead
 
  // Anima o número de 0 até o valor atual na carga da página
  function animateToValue(start, end, duration) {
    const startTime = performance.now();
    function update(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing easeOutExpo
      const eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value    = Math.floor(start + (end - start) * eased);
      tickerEl.textContent = value.toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
 
  // Animação inicial: 0 → valor atual em 2.5s
  animateToValue(0, currentValue, 2500);
 
  // Após a animação inicial, incrementa devagar simulando tempo real
  setTimeout(() => {
    setInterval(() => {
      currentValue += Math.floor(Math.random() * 3) + 1; // +1 a +3 t a cada ~1s
      tickerEl.textContent = currentValue.toLocaleString('pt-BR');
    }, 1100);
  }, 2600);
})();
 
 
/* ═══════════════════════════════════════════════════════════
   3. ANIMAÇÕES DE ENTRADA (Intersection Observer)
   Adiciona classe "fade-in-up" a elementos selecionados
   e dispara "visible" ao entrar na viewport.
   ═══════════════════════════════════════════════════════════ */
 
(function initScrollAnimations() {
  // Respeita preferência por movimento reduzido
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 
  const animatables = [
    '.stat-card',
    '.flow-step',
    '.practice-card',
    '.tech-item',
    '.intro-text p',
    '.callout',
    '.section-header',
  ];
 
  // Adiciona classe base
  document.querySelectorAll(animatables.join(',')).forEach((el, i) => {
    el.classList.add('fade-in-up');
    // Escalonamento leve por grupo (delay proporcional ao índice dentro do pai)
    const siblings = el.parentElement?.children;
    if (siblings) {
      const idx = Array.from(siblings).indexOf(el);
      el.style.transitionDelay = `${idx * 60}ms`;
    }
  });
 
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // só anima uma vez
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
 
  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
})();
 
 
/* ═══════════════════════════════════════════════════════════
   4. QUIZ INTERATIVO
   5 perguntas sobre práticas agrícolas sustentáveis e
   mercado de carbono. Gerencia estado, DOM e acessibilidade.
   ═══════════════════════════════════════════════════════════ */
 
(function initQuiz() {
 
  // ── 4.1 Banco de perguntas ──────────────────────────────
  const questions = [
    {
      text: 'O que é um "crédito de carbono" no contexto do agronegócio?',
      options: [
        'Um empréstimo bancário para compra de maquinário agrícola',
        'Um certificado que representa 1 tonelada de CO₂ não emitida ou capturada',
        'Um subsídio do governo para reduzir o uso de fertilizantes',
        'Uma pontuação de sustentabilidade dada pela Embrapa',
      ],
      correct: 1,
      feedback: '✅ Correto! Um crédito de carbono equivale a exatamente 1 tonelada de CO₂ equivalente que foi evitada ou removida da atmosfera. Esse crédito pode ser vendido a empresas que precisam compensar suas próprias emissões.',
      wrongFeedback: '❌ Incorreto. Um crédito de carbono é um certificado que representa 1 tonelada de CO₂ equivalente que deixou de ser emitida ou foi capturada da atmosfera. Ele é negociado em mercados voluntários ou regulados.',
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
      feedback: '✅ Exato! Ao não arar o solo, o SPD preserva a matéria orgânica e o carbono que estão estocados naturalmente. O solo torna-se um "reservatório" de carbono em vez de uma fonte emissora.',
      wrongFeedback: '❌ Incorreto. O grande benefício climático do Plantio Direto é que, ao não revolver o solo, o carbono presente na matéria orgânica permanece "preso" ali — transformando o solo em um sequestrador de carbono.',
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
      feedback: '✅ Perfeito! ILPF = Integração Lavoura-Pecuária-Floresta. É um sistema em que grãos, gado e árvores convivem no mesmo espaço. As árvores absorvem o CO₂ gerado pelo rebanho e ainda geram renda com madeira futura.',
      wrongFeedback: '❌ ILPF significa Integração Lavoura-Pecuária-Floresta. É um modelo inovador desenvolvido no Brasil que combina cultivo de grãos, criação de animais e plantio de árvores na mesma área, gerando benefícios climáticos e produtivos.',
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
      feedback: '✅ Correto! Drones e satélites permitem mapear a saúde e a densidade da vegetação. Com esses dados, algoritmos calculam a biomassa e, consequentemente, quanto carbono aquela área está retendo — dado essencial para a certificação de créditos.',
      wrongFeedback: '❌ A tecnologia correta são os drones e imagens de satélite. Eles mapeiam a vegetação e calculam a biomassa (quantidade de matéria orgânica), permitindo estimar com precisão o carbono sequestrado para fins de certificação.',
    },
    {
      text: 'Por que a substituição de fertilizantes nitrogenados sintéticos por Fixação Biológica de Nitrogênio (FBN) reduz as emissões de GEE?',
      options: [
        'Porque a FBN usa energia solar para funcionar, eliminando máquinas',
        'Porque fertilizantes nitrogenados sintéticos liberam óxido nitroso (N₂O), um GEE cerca de 300× mais potente que o CO₂, em sua fabricação e uso',
        'Porque a FBN elimina totalmente a necessidade de colheita mecanizada',
        'Porque as bactérias da FBN produzem oxigênio puro no solo',
      ],
      correct: 1,
      feedback: '✅ Excelente! O óxido nitroso (N₂O), liberado durante a fabricação e aplicação de fertilizantes nitrogenados, tem potencial de aquecimento global cerca de 265-300 vezes maior que o CO₂. A FBN usa bactérias naturais para fornecer nitrogênio, eliminando essa fonte de emissão.',
      wrongFeedback: '❌ A resposta correta é sobre o N₂O. Fertilizantes nitrogenados sintéticos liberam óxido nitroso (N₂O) durante a produção industrial e quando aplicados ao solo. O N₂O é um gás de efeito estufa extremamente potente — cerca de 300× o impacto do CO₂.',
    },
  ];
 
  // ── 4.2 Estado do quiz ──────────────────────────────────
  let state = {
    current:  0,    // índice da pergunta atual
    score:    0,    // respostas corretas
    answered: false // se a pergunta atual já foi respondida
  };
 
  // ── 4.3 Referências ao DOM ──────────────────────────────
  const screens = {
    start:    document.getElementById('quizStart'),
    question: document.getElementById('quizQuestion'),
    result:   document.getElementById('quizResult'),
  };
 
  const els = {
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    questionText: document.getElementById('questionText'),
    optionsList:  document.getElementById('optionsList'),
    feedback:     document.getElementById('quizFeedback'),
    nextBtn:      document.getElementById('nextBtn'),
    startBtn:     document.getElementById('startQuizBtn'),
    retryBtn:     document.getElementById('retryBtn'),
    scoreArc:     document.getElementById('scoreArc'),
    scoreLabel:   document.getElementById('scoreLabel'),
    resultTitle:  document.getElementById('resultTitle'),
    resultMessage:document.getElementById('resultMessage'),
  };
 
  // ── 4.4 Funções auxiliares ──────────────────────────────
 
  /** Mostra apenas a tela passada, oculta as demais. */
  function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
      if (!el) return;
      if (key === name) {
        el.classList.remove('quiz-screen--hidden');
      } else {
        el.classList.add('quiz-screen--hidden');
      }
    });
  }
 
  /** Rende a pergunta no índice `idx`. */
  function renderQuestion(idx) {
    const q = questions[idx];
    state.answered = false;
 
    // Progresso
    const pct = ((idx) / questions.length) * 100;
    els.progressFill.style.width = pct + '%';
    els.progressText.textContent = `Pergunta ${idx + 1} de ${questions.length}`;
 
    // Texto
    els.questionText.textContent = q.text;
 
    // Opções — recria todos os botões
    els.optionsList.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
 
    q.options.forEach((optText, i) => {
      const li  = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.dataset.index = String(i);
      btn.innerHTML = `
        <span class="option-marker" aria-hidden="true">${letters[i]}</span>
        <span>${optText}</span>
      `;
      btn.addEventListener('click', () => handleAnswer(i));
      li.appendChild(btn);
      els.optionsList.appendChild(li);
    });
 
    // Esconde feedback e botão Próxima
    els.feedback.className = 'quiz-feedback';
    els.feedback.textContent = '';
    els.nextBtn.style.display = 'none';
 
    showScreen('question');
  }
 
  /** Processa a escolha do usuário. */
  function handleAnswer(chosenIdx) {
    if (state.answered) return; // Evita duplo clique
    state.answered = true;
 
    const q       = questions[state.current];
    const correct = chosenIdx === q.correct;
 
    if (correct) state.score++;
 
    // Marca visualmente todos os botões
    const allBtns = els.optionsList.querySelectorAll('.option-btn');
    allBtns.forEach((btn, i) => {
      btn.disabled = true;
      btn.setAttribute('aria-checked', String(i === chosenIdx));
 
      if (i === q.correct) {
        btn.classList.add('correct');
        btn.querySelector('.option-marker').textContent = '✓';
      } else if (i === chosenIdx && !correct) {
        btn.classList.add('wrong');
        btn.querySelector('.option-marker').textContent = '✗';
      }
    });
 
    // Exibe feedback contextual
    els.feedback.textContent = correct ? q.feedback : q.wrongFeedback;
    els.feedback.className   = `quiz-feedback visible ${correct ? 'feedback-correct' : 'feedback-wrong'}`;
 
    // Exibe botão de avançar
    els.nextBtn.style.display = 'block';
    setTimeout(() => els.nextBtn.focus(), 80);
  }
 
  /** Avança para próxima pergunta ou para o resultado. */
  function advanceQuiz() {
    state.current++;
    if (state.current < questions.length) {
      renderQuestion(state.current);
    } else {
      showResult();
    }
  }
 
  /** Exibe a tela de resultado com animação do arco. */
  function showResult() {
    const total = questions.length;
    const score = state.score;
    const pct   = score / total;
 
    // Atualiza barra de progresso para 100%
    els.progressFill.style.width = '100%';
 
    // Label e título
    els.scoreLabel.textContent = `${score}/${total}`;
 
    // Animação do arco SVG (circunferência = 2π × 50 ≈ 314)
    const circ   = 314;
    const offset = circ - circ * pct;
    setTimeout(() => {
      els.scoreArc.style.strokeDashoffset = offset;
      els.scoreArc.style.transition = 'stroke-dashoffset 1s ease';
    }, 120);
 
    // Mensagem de acordo com pontuação
    const messages = [
      { min: 5, title: '🌳 Especialista em Campo Sustentável!', msg: 'Incrível! Você domina os conceitos de descarbonização no agronegócio. Está pronto para fazer parte dessa revolução verde!' },
      { min: 4, title: '🌿 Quase lá, futuro agrônomo!',         msg: 'Ótimo desempenho! Você já conhece bem o tema. Revise as questões que errou e repita o quiz — você chega lá!' },
      { min: 3, title: '🌱 Bom começo, continue aprendendo!',   msg: 'Você está no caminho certo. Leia as seções sobre o Mercado de Carbono e Práticas ABC+ para reforçar seu conhecimento.' },
      { min: 0, title: '🪴 O aprendizado está começando!',      msg: 'Não desanime — o tema é novo e importante. Explore todas as seções do site e tente o quiz novamente. Você vai melhorar!' },
    ];
 
    const result = messages.find(m => score >= m.min);
    els.resultTitle.textContent   = result.title;
    els.resultMessage.textContent = result.msg;
 
    showScreen('result');
  }
 
  /** Reinicia o quiz do zero. */
  function resetQuiz() {
    state = { current: 0, score: 0, answered: false };
    els.progressFill.style.width = '0%';
    // Reseta arco sem transição
    els.scoreArc.style.transition = 'none';
    els.scoreArc.style.strokeDashoffset = '314';
    renderQuestion(0);
  }
 
  // ── 4.5 Eventos ────────────────────────────────────────
  els.startBtn?.addEventListener('click', () => renderQuestion(0));
  els.nextBtn?.addEventListener('click', advanceQuiz);
  els.retryBtn?.addEventListener('click', resetQuiz);
 
  // Navegação por teclado nas opções (setas ↑↓)
  els.optionsList?.addEventListener('keydown', (e) => {
    if (!['ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const btns    = Array.from(els.optionsList.querySelectorAll('.option-btn:not(:disabled)'));
    const focused = document.activeElement;
    const idx     = btns.indexOf(focused);
    if (idx === -1) return;
    const next = e.key === 'ArrowDown' ? btns[idx + 1] : btns[idx - 1];
    next?.focus();
  });
 
})(); // fim initQuiz
 