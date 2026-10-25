const question = document.getElementById('question');
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const timerText = document.getElementById('timer');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const categoryBadge = document.getElementById('categoryBadge');
const playerBadge = document.getElementById('playerBadge');
const choiceButtons = Array.from(document.querySelectorAll('.choice-container'));

const difficultySettings = {
  Easy: 18,
  Medium: 13,
  Hard: 10
};

const selectedDifficulty = localStorage.getItem('selectedDifficulty') || 'Easy';
const DEFAULT_TIME_LIMIT = difficultySettings[selectedDifficulty] || 15;
const selectedQuestionCount = Number(localStorage.getItem('questionCount')) || 10;
const MAX_QUESTIONS = Math.min(selectedQuestionCount, 20);
const selectedCategory = localStorage.getItem('selectedCategory') || 'General Knowledge';
const players = JSON.parse(localStorage.getItem('players')) || ['Player 1', 'Player 2'];
const multiplayerMode = JSON.parse(localStorage.getItem('multiplayerMode')) || false;
const gameMode = localStorage.getItem('gameMode') || 'multiplayer';

const startOverlay = document.getElementById('startOverlay');
const levelPopup = document.getElementById('levelPopup');
const streakBadge = document.getElementById('streakBadge');

let currentQuestion = null;
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let questions = [];
let timerId = null;
let timeLeft = DEFAULT_TIME_LIMIT;
let currentStreak = 0;
let currentPlayerIndex = 0;
let playerScores = players.map(() => 0);

function playTone(type, frequency, duration, volume = 0.08) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const audioContext = new AudioCtx();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  gainNode.gain.value = volume;
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    audioContext.close();
  }, duration);
}

function playFeedbackSound(status) {
  if (status === 'correct') {
    playTone('triangle', 660, 180, 0.08);
    setTimeout(() => playTone('triangle', 880, 180, 0.08), 110);
  } else if (status === 'wrong') {
    playTone('sawtooth', 220, 220, 0.08);
  } else if (status === 'timeout') {
    playTone('square', 140, 220, 0.08);
    setTimeout(() => playTone('sawtooth', 110, 240, 0.07), 130);
  } else {
    playTone('square', 180, 220, 0.06);
  }
}

const fallbackQuestions = [
  {
    category: 'General Knowledge',
    question: 'The International Literacy Day is observed on?',
    choices: ['Sep 8', 'Nov 28', 'May 2', 'Sep 22'],
    answer: 1
  },
  {
    category: 'General Knowledge',
    question: 'Which day is observed as World Standards Day?',
    choices: ['Jun 26', 'Oct 14', 'Nov 15', 'Dec 2'],
    answer: 2
  },
  {
    category: 'General Knowledge',
    question: 'Who is the richest person in the world?',
    choices: ['Bill Gates', 'Elon Musk', 'Bernard Arnault & Family', 'Jeff Bezos'],
    answer: 3
  },
  {
    category: 'General Knowledge',
    question: 'What is the full form of CBI?',
    choices: ['Central Bank of India', 'Crime Branch of India', 'Central Bureau of Investigation', 'Corporate Business Intelligence'],
    answer: 3
  },
  {
    category: 'General Knowledge',
    question: 'What is the capital city of Japan?',
    choices: ['Seoul', 'Tokyo', 'Osaka', 'Kyoto'],
    answer: 2
  },
  {
    category: 'India',
    question: 'The language of Lakshadweep is?',
    choices: ['Hindi', 'Tamil', 'Telugu', 'Malayalam'],
    answer: 4
  },
  {
    category: 'India',
    question: 'Who is the current Prime Minister of India?',
    choices: ['Rahul Gandhi', 'Narendra Modi', 'Manmohan Singh', 'Jawaharlal Nehru'],
    answer: 2
  },
  {
    category: 'India',
    question: 'Where is the Taj Mahal located?',
    choices: ['Agra', 'Delhi', 'Mumbai', 'Mathura'],
    answer: 1
  },
  {
    category: 'India',
    question: 'Who was the first President of India?',
    choices: ['A.P.J. Abdul Kalam', 'Dr. Rajendra Prasad', 'Sarvepalli Radhakrishnan', 'Zakir Hussain'],
    answer: 2
  },
  {
    category: 'India',
    question: 'On which day is Independence Day celebrated in India?',
    choices: ['14 November', '15 August', '26 January', '2 October'],
    answer: 2
  },
  {
    category: 'Science',
    question: 'Which gas do plants absorb from the atmosphere?',
    choices: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
    answer: 2
  },
  {
    category: 'Science',
    question: 'What is the chemical formula of water?',
    choices: ['CO2', 'H2O', 'O2', 'NaCl'],
    answer: 2
  },
  {
    category: 'Science',
    question: 'Which planet is known as the Red Planet?',
    choices: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    answer: 2
  },
  {
    category: 'Science',
    question: 'What is the hardest natural substance on Earth?',
    choices: ['Steel', 'Gold', 'Diamond', 'Quartz'],
    answer: 3
  },
  {
    category: 'Science',
    question: 'Which part of the human body pumps blood?',
    choices: ['Brain', 'Lungs', 'Heart', 'Kidney'],
    answer: 3
  }
];

function shuffleArray(items) {
  const newItems = [...items];
  for (let i = newItems.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [newItems[i], newItems[j]] = [newItems[j], newItems[i]];
  }
  return newItems;
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = DEFAULT_TIME_LIMIT;
  timerText.textContent = `${timeLeft}s`;
  timerText.classList.remove('warning');

  timerId = setInterval(() => {
    timeLeft -= 1;
    timerText.textContent = `${Math.max(0, timeLeft)}s`;

    if (timeLeft <= 5) {
      timerText.classList.add('warning');
    }

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleTimeout();
    }
  }, 1000);
}

function incrementScore(points) {
  score += points;
  playerScores[currentPlayerIndex] += points;
  scoreText.textContent = playerScores[currentPlayerIndex];
}

function updateStreakBadge() {
  streakBadge.textContent = currentStreak > 0 ? `Streak x${currentStreak}` : 'Streak x0';
}

function updatePlayerBadge() {
  const playerName = players[currentPlayerIndex] || `Player ${currentPlayerIndex + 1}`;
  if (gameMode === 'solo') {
    playerBadge.textContent = 'Solo';
  } else if (gameMode === 'team') {
    playerBadge.textContent = playerName.includes('Team') ? playerName : `Team ${currentPlayerIndex + 1}`;
  } else {
    playerBadge.textContent = playerName;
  }
  scoreText.textContent = playerScores[currentPlayerIndex] || 0;
}

function updateProgress() {
  const totalQuestions = Math.max(questions.length, 1);
  const progress = (questionCounter / totalQuestions) * 100;
  progressBarFull.style.width = `${progress}%`;
  progressText.textContent = `Question ${questionCounter}/${totalQuestions}`;
}

function endGame() {
  clearInterval(timerId);
  const popupBox = levelPopup.querySelector('.popup-box');
  const winner = multiplayerMode
    ? players[playerScores.indexOf(Math.max(...playerScores))]
    : 'Player 1';

  popupBox.innerHTML = `
    <p class="eyebrow">Level complete</p>
    <h3>${winner} wins!</h3>
  `;
  localStorage.setItem('finalWinnerLabel', winner);
  levelPopup.classList.remove('hidden');
  levelPopup.classList.add('show');

  setTimeout(() => {
    localStorage.setItem('mostRecentScore', String(score));
    localStorage.setItem('gameResults', JSON.stringify({ players, scores: playerScores }));
    window.location.href = './end.html';
  }, 1400);
}

function handleTimeout() {
  if (!acceptingAnswers) return;

  acceptingAnswers = false;
  clearInterval(timerId);
  playFeedbackSound('timeout');
  timerText.classList.remove('warning');
  currentStreak = 0;
  updateStreakBadge();

  choiceButtons.forEach((button) => {
    button.disabled = true;
    const buttonNumber = Number(button.dataset.number);
    if (buttonNumber === currentQuestion.answer) {
      button.classList.add('correct');
    }
  });

  setTimeout(() => {
    advanceTurn();
    getNewQuestion();
  }, 900);
}

function setAnswerState(selectedButton, isCorrect) {
  choiceButtons.forEach((button) => {
    button.disabled = true;
    const buttonNumber = Number(button.dataset.number);

    if (buttonNumber === currentQuestion.answer) {
      button.classList.add('correct');
    }
  });

  selectedButton.classList.add(isCorrect ? 'correct' : 'incorrect');

  if (isCorrect) {
    currentStreak += 1;
    const streakBonus = currentStreak * 5;
    incrementScore(10 + timeLeft + streakBonus);
  } else {
    currentStreak = 0;
  }

  updateStreakBadge();
}

function advanceTurn() {
  if (!multiplayerMode) return;
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updatePlayerBadge();
}

function getNewQuestion() {
  if (questionCounter >= questions.length) {
    endGame();
    return;
  }

  currentQuestion = questions[questionCounter];
  questionCounter += 1;
  acceptingAnswers = true;

  question.textContent = currentQuestion.question;
  updateProgress();
  updatePlayerBadge();

  choiceButtons.forEach((button, index) => {
    button.classList.remove('correct', 'incorrect');
    button.disabled = false;
    button.textContent = currentQuestion.choices[index];
  });

  startTimer();
}

function startGame() {
  questionCounter = 0;
  score = 0;
  currentStreak = 0;
  currentPlayerIndex = 0;
  playerScores = players.map(() => 0);
  scoreText.textContent = '0';
  categoryBadge.textContent = selectedCategory;
  updatePlayerBadge();
  updateStreakBadge();
  game.classList.remove('hidden');
  loader.classList.add('hidden');
  const shuffledQuestions = shuffleArray(questions).slice(0, Math.min(MAX_QUESTIONS, questions.length));
  questions = shuffledQuestions;

  setTimeout(() => {
    startOverlay.classList.add('hidden');
    getNewQuestion();
  }, 900);
}

async function loadQuestions() {
  const categoryNames = ['General Knowledge', 'India', 'Science'];
  const selected = categoryNames.includes(selectedCategory) ? selectedCategory : 'General Knowledge';

  try {
    const response = await fetch('./questions.json');
    const loadedQuestions = await response.json();
    const filteredQuestions = Array.isArray(loadedQuestions)
      ? loadedQuestions.filter((item) => item.category === selected)
      : [];

    questions = filteredQuestions.length ? filteredQuestions : fallbackQuestions.filter((item) => item.category === selected);
  } catch (error) {
    console.warn('Local questions file unavailable. Using fallback questions.', error);
    questions = fallbackQuestions.filter((item) => item.category === selected);
  }

  if (!questions.length) {
    questions = fallbackQuestions;
  }

  startGame();
}

const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', () => {
  localStorage.removeItem('selectedCategory');
  localStorage.removeItem('selectedDifficulty');
  localStorage.removeItem('gameMode');
  localStorage.removeItem('players');
  localStorage.removeItem('multiplayerMode');
  localStorage.removeItem('questionCount');
  localStorage.removeItem('mostRecentScore');
  localStorage.removeItem('gameResults');
  window.location.href = './index.html';
});

choiceButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    clearInterval(timerId);

    const selectedAnswer = Number(event.currentTarget.dataset.number);
    const isCorrect = selectedAnswer === currentQuestion.answer;

    playFeedbackSound(isCorrect ? 'correct' : 'wrong');
    timerText.classList.remove('warning');
    setAnswerState(event.currentTarget, isCorrect);

    setTimeout(() => {
      if (multiplayerMode) {
        advanceTurn();
      }
      getNewQuestion();
    }, 900);
  });
});

loadQuestions();