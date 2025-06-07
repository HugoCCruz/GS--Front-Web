// Funcionalidade principal do JavaScript

// Variáveis globais
let currentSlideIndex = 0; // Índice do slide atual no carrossel
let currentQuestionIndex = 0; // Índice da pergunta atual no quiz
let score = 0; // Pontuação do usuário no quiz
let selectedAnswer = null; // Resposta selecionada pelo usuário

// Perguntas do quiz
const quizQuestions = [
  // Cada objeto representa uma pergunta, com alternativas e o índice da correta
  {
    question: "Qual é a principal causa de alagamentos urbanos?",
    answers: [
      "Falta de árvores na cidade",
      "Impermeabilização do solo e sistema de drenagem inadequado",
      "Excesso de carros nas ruas",
      "Poluição do ar"
    ],
    correct: 1 // Índice da resposta correta
  },
  // ... (demais perguntas)
];

// Evento disparado quando o DOM está totalmente carregado
document.addEventListener('DOMContentLoaded', function() {
  initializeApp(); // Inicializa a aplicação
});

// Inicializa a aplicação, configurando todos os recursos
function initializeApp() {
  setupEventListeners();      // Configura eventos de navegação
  setupScrollAnimations();    // Configura animações ao rolar a página
  setupSlideshow();           // Configura o carrossel de slides
  setupThemeSwitcher();       // Configura troca de tema (claro/escuro)
  setupHamburgerMenu();       // Configura menu hambúrguer (mobile)
  setupFormValidation();      // Configura validação do formulário de contato
}

// Configura os eventos dos links de navegação
function setupEventListeners() {
  // Rolagem suave ao clicar nos links do menu
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault(); // Impede comportamento padrão do link
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // Fecha o menu mobile se estiver aberto
        const nav = document.getElementById('nav');
        const hamburger = document.getElementById('hamburger');
        nav.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  });
}

// Configura animações de fade-in ao rolar a página
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  // Usa IntersectionObserver para detectar quando elementos aparecem na tela
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); // Adiciona classe para animar
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.fade-in');
  animatedElements.forEach(el => {
    observer.observe(el); // Observa cada elemento animado
  });
}



// Mostra o slide de acordo com o índice
function showSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicator');
  
  // Garante que o índice está dentro do intervalo
  if (index >= slides.length) {
    currentSlideIndex = 0;
  }
  if (index < 0) {
    currentSlideIndex = slides.length - 1;
  }
  
  // Remove classe ativa de todos os slides e indicadores
  slides.forEach(slide => slide.classList.remove('active'));
  indicators.forEach(indicator => indicator.classList.remove('active'));
  
  // Ativa o slide e indicador atual
  if (slides[currentSlideIndex]) {
    slides[currentSlideIndex].classList.add('active');
  }
  if (indicators[currentSlideIndex]) {
    indicators[currentSlideIndex].classList.add('active');
  }
}

// Altera o slide atual (direção: 1 para frente, -1 para trás)
function changeSlide(direction) {
  currentSlideIndex += direction;
  showSlide(currentSlideIndex);
}

// Vai para um slide específico (usado por indicadores)
function currentSlide(index) {
  currentSlideIndex = index - 1;
  showSlide(currentSlideIndex);
}

// Configura troca de tema (claro/escuro)
function setupThemeSwitcher() {
  const themeButtons = document.querySelectorAll('.theme-btn');
  
  themeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const theme = this.getAttribute('data-theme');
      changeTheme(theme);
      
      // Atualiza botão ativo
      themeButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Define tema padrão como ativo
  document.querySelector('[data-theme="default"]').classList.add('active');
}

// Altera o tema do site
function changeTheme(theme) {
  const body = document.body;
  
  // Remove classes de tema existentes
  body.classList.remove('theme-dark', 'theme-light');
  
  // Adiciona nova classe de tema, se não for o padrão
  if (theme !== 'default') {
    body.classList.add('theme-' + theme);
  }
}

// Configura menu hambúrguer para navegação mobile
function setupHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  
  hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    nav.classList.toggle('active');
  });
  
  // Fecha o menu ao clicar fora dele
  document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
    }
  });
}

// Inicia o quiz
function startQuiz() {
  document.getElementById('quiz-start').style.display = 'none';
  document.getElementById('quiz-questions').style.display = 'block';
  document.getElementById('total-questions').textContent = quizQuestions.length;
  
  currentQuestionIndex = 0;
  score = 0;
  selectedAnswer = null;
  
  showQuestion(); // Mostra a primeira pergunta
}

// Mostra a pergunta atual do quiz
function showQuestion() {
  const question = quizQuestions[currentQuestionIndex];
  document.getElementById('current-question').textContent = currentQuestionIndex + 1;
  document.getElementById('question-text').textContent = question.question;
  
  const answersContainer = document.getElementById('answers');
  answersContainer.innerHTML = '';
  
  // Cria botões para cada alternativa
  question.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.className = 'answer-btn';
    button.textContent = answer;
    button.onclick = function() {
      selectAnswer(index, button);
    };
    answersContainer.appendChild(button);
  });
  
  document.getElementById('next-btn').style.display = 'none';
  selectedAnswer = null;
}

// Seleciona uma resposta no quiz
function selectAnswer(answerIndex, buttonElement) {
  // Remove seleções anteriores e desativa botões
  const answerButtons = document.querySelectorAll('.answer-btn');
  answerButtons.forEach(btn => {
    btn.classList.remove('selected', 'correct', 'incorrect');
    btn.onclick = null; // Impede novos cliques
  });
  
  selectedAnswer = answerIndex;
  const question = quizQuestions[currentQuestionIndex];
  
  // Mostra visualmente a resposta correta/incorreta
  answerButtons.forEach((btn, index) => {
    if (index === question.correct) {
      btn.classList.add('correct');
    } else if (index === answerIndex && index !== question.correct) {
      btn.classList.add('incorrect');
    }
  });
  
  // Atualiza pontuação se acertou
  if (answerIndex === question.correct) {
    score++;
  }
  
  // Exibe botão para próxima pergunta
  document.getElementById('next-btn').style.display = 'inline-block';
}

// Vai para a próxima pergunta do quiz
function nextQuestion() {
  currentQuestionIndex++;
  
  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();
  } else {
    showQuizResult();
  }
}

// Mostra o resultado final do quiz
function showQuizResult() {
  document.getElementById('quiz-questions').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'block';
  
  const percentage = Math.round((score / quizQuestions.length) * 100);
  document.getElementById('final-score').textContent = score + '/' + quizQuestions.length + ' (' + percentage + '%)';
  
  let message = '';
  if (percentage >= 80) {
    message = 'Excelente! Você tem um ótimo conhecimento sobre proteção contra alagamentos!';
  } else if (percentage >= 60) {
    message = 'Bom trabalho! Você entende bem os conceitos básicos de proteção contra enchentes.';
  } else if (percentage >= 40) {
    message = 'Não está mal! Que tal aprender mais sobre sistemas de proteção contra alagamentos?';
  } else {
    message = 'Você pode melhorar! Recomendamos estudar mais sobre prevenção de enchentes.';
  }
  
  document.getElementById('result-message').textContent = message;
}

// Reinicia o quiz
function restartQuiz() {
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('quiz-start').style.display = 'block';
}

// Configura validação do formulário de contato
function setupFormValidation() {
  const form = document.getElementById('contact-form');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      // Simula envio do formulário
      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      form.reset();
      clearErrors();
    }
  });
  
  // Validação em tempo real dos campos
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        validateField(this);
      }
    });
  });
}

// Valida todos os campos do formulário
function validateForm() {
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  
  let isValid = true;
  
  if (!validateField(name)) isValid = false;
  if (!validateField(email)) isValid = false;
  if (!validateField(message)) isValid = false;
  
  return isValid;
}

// Valida um campo individual do formulário
function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  let isValid = true;
  let errorMessage = '';
  
  // Limpa erro anterior
  field.classList.remove('error');
  const errorElement = document.getElementById(fieldName + '-error');
  if (errorElement) {
    errorElement.textContent = '';
  }
  
  // Validação de campo obrigatório
  if (field.hasAttribute('required') && !value) {
    errorMessage = 'Este campo é obrigatório.';
    isValid = false;
  }
  
  // Validação de email
  if (fieldName === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errorMessage = 'Por favor, insira um email válido.';
      isValid = false;
    }
  }
  
  // Validação do nome
  if (fieldName === 'name' && value && value.length < 2) {
    errorMessage = 'Nome deve ter pelo menos 2 caracteres.';
    isValid = false;
  }
  
  // Validação da mensagem
  if (fieldName === 'message' && value && value.length < 10) {
    errorMessage = 'Mensagem deve ter pelo menos 10 caracteres.';
    isValid = false;
  }
  
  // Mostra erro se inválido
  if (!isValid) {
    field.classList.add('error');
    if (errorElement) {
      errorElement.textContent = errorMessage;
    }
  }
  
  return isValid;
}

// Limpa todos os erros do formulário
function clearErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(element => {
    element.textContent = '';
  });
  
  const errorFields = document.querySelectorAll('.error');
  errorFields.forEach(field => {
    field.classList.remove('error');
  });
}
