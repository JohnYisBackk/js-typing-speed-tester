"use strict";

lucide.createIcons();

// ===============================
// 1. SELECT ELEMENTS
// ===============================

const themeBtn = document.getElementById("themeBtn");

const infoBtn = document.getElementById("infoBtn");

const timeValue = document.getElementById("timeValue");
const wpmValue = document.getElementById("wpmValue");
const accuracyValue = document.getElementById("accuracyValue");
const mistakesValue = document.getElementById("mistakesValue");
const progressValue = document.getElementById("progressValue");

const textDisplay = document.getElementById("textDisplay");
const textToType = document.getElementById("textToType");

const typingInput = document.getElementById("typingInput");

const bestWpm = document.getElementById("bestWpm");
const bestAccuracy = document.getElementById("bestAccuracy");
const testsTaken = document.getElementById("testsTaken");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

// ===============================
// 2. STATE
// ===============================

let timeLeft = 0;

let timerId = null;

let isRunning = false;

let currentText = "";

let mistakes = 0;
let wpm = 0;
let accuracy = 100;
let progress = 0;

let bestWpmValue = 0;
let bestAccuracyValue = 0;
let testsTakenValue = 0;

// ===============================
// 3. TEXT DATA
// ===============================

const textData = [
  "The quick brown fox jumps over the lazy dog. This is a sample text to test your typing speed and accuracy. Try to type this entire text as fast and as accurately as possible. Good luck!",

  "Success comes from consistent effort, patience, and the willingness to improve every single day. Small progress can eventually create remarkable results.",

  "Programming is not only about writing code. It is about solving problems, understanding logic, learning from mistakes, and building useful things.",

  "Technology continues to change the way we work, communicate, and create. Learning new skills helps us adapt and discover new opportunities.",

  "Focus on accuracy before speed. Once your fingers become comfortable with the keyboard, your typing speed will naturally begin to improve.",
];

// ===============================
// 4. START TEST
// ===============================

function startTest() {
  const randomIndex = Math.floor(Math.random() * textData.length);

  currentText = textData[randomIndex];

  timeLeft = 60;

  mistakes = 0;
  wpm = 0;
  accuracy = 100;
  progress = 0;

  isRunning = true;

  renderText();

  typingInput.value = "";
  typingInput.disabled = false;
  typingInput.focus();

  startBtn.disabled = true;

  timeValue.textContent = timeLeft;
  wpmValue.textContent = 0;
  accuracyValue.textContent = "100%";
  mistakesValue.textContent = 0;
  progressValue.textContent = "0%";

  startTimer();
}

// ===============================
// 5. START TIMER
// ===============================

function startTimer() {
  clearInterval(timerId);

  timerId = setInterval(() => {
    timeLeft--;

    timeValue.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerId);

      finishTest();
    }
  }, 1000);
}

// ===============================
// 6. HANDLE TYPING
// ===============================

function handleTyping() {
  if (!isRunning) return;

  const typedText = typingInput.value;

  mistakes = calculateMistakes(typedText);

  wpm = calculateWpm(typedText);

  accuracy = calculateAccuracy(typedText);

  progress = updateProgress(typedText);

  updateLiveStats();

  if (typedText.length >= currentText.length) {
    finishTest();
  }
}

// ===============================
// 7. CALCULATE WPM
// ===============================

function calculateWpm(typedText) {
  const elapsedSeconds = 60 - timeLeft;

  if (elapsedSeconds <= 0 || typedText.trim() === "") {
    return 0;
  }

  const wordsTyped = typedText.trim().split(/\s+/).length;

  const minutes = elapsedSeconds / 60;

  const calculatedWpm = wordsTyped / minutes;

  return Math.round(calculatedWpm);
}

// ===============================
// 8. CALCULATE ACCURACY
// ===============================

function calculateAccuracy(typedText) {
  if (typedText.length === 0) return 100;

  const correctCharacters = typedText.length - mistakes;

  const calculatedAccuracy = (correctCharacters / typedText.length) * 100;

  return Math.round(calculatedAccuracy);
}

// ===============================
// 9. CALCULATE MISTAKES
// ===============================

function calculateMistakes(typedText) {
  let mistakeCount = 0;

  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] !== currentText[i]) {
      mistakeCount++;
    }
  }

  return mistakeCount;
}

// ===============================
// 10. UPDATE PROGRESS
// ===============================

function updateProgress(typedText) {
  if (currentText.length === 0) return 0;

  const calculatedProgress = (typedText.length / currentText.length) * 100;

  return Math.min(Math.round(calculatedProgress), 100);
}

// ===============================
// 11. UPDATE LIVE STATS
// ===============================

function updateLiveStats() {
  wpmValue.textContent = wpm;
  accuracyValue.textContent = `${accuracy}%`;
  mistakesValue.textContent = mistakes;
  progressValue.textContent = `${progress}%`;
}

// ===============================
// 12. FINISH TEST
// ===============================

function finishTest() {
  if (!isRunning) return;

  isRunning = false;

  clearInterval(timerId);
  timerId = null;

  typingInput.disabled = true;

  testsTakenValue++;

  updateBestResults();

  startBtn.disabled = false;
}

// ===============================
// 13. UPDATE BEST RESULTS
// ===============================

function updateBestResults() {
  if (wpm > bestWpmValue) {
    bestWpmValue = wpm;
  }

  if (accuracy > bestAccuracyValue) {
    bestAccuracyValue = accuracy;
  }

  bestWpm.textContent = bestWpmValue;
  bestAccuracy.textContent = `${bestAccuracyValue}%`;
  testsTaken.textContent = testsTakenValue;
}

// ===============================
// 14. RENDER TEXT
// ===============================

function renderText() {
  textToType.innerHTML = "";

  currentText.split("").forEach((character) => {
    const span = document.createElement("span");

    span.textContent = character;

    textToType.appendChild(span);
  });
}

// ===============================
// 15. RESET TEST
// ===============================

function resetTest() {
  clearInterval(timerId);

  timerId = null;

  timeLeft = 60;

  isRunning = false;

  mistakes = 0;
  wpm = 0;
  accuracy = 100;
  progress = 0;

  typingInput.value = "";
  typingInput.disabled = true;

  timeValue.textContent = 60;
  wpmValue.textContent = 0;
  accuracyValue.textContent = "100%";
  mistakesValue.textContent = 0;
  progressValue.textContent = "0%";

  startBtn.disabled = false;

  renderText();
}

// ===============================
// 16. TOGGLE THEME
// ===============================

function toggleTheme() {
  document.body.classList.toggle("dark-theme");

  const isDarkMode = document.body.classList.contains("dark-theme");

  localStorage.setItem("typingSpeedTester", isDarkMode);

  themeBtn.innerHTML = isDarkMode
    ? ` <i data-lucide="sun"></i>`
    : ` <i data-lucide="moon"></i>`;

  lucide.createIcons();
}

// ===============================
// 17. LOAD THEME
// ===============================

function loadTheme() {
  const isDarkMode = localStorage.getItem("typingSpeedTester") === "true";

  if (isDarkMode) {
    document.body.classList.add("dark-theme");
  }

  themeBtn.innerHTML = isDarkMode
    ? ` <i data-lucide="sun"></i>`
    : ` <i data-lucide="moon"></i>`;

  lucide.createIcons();
}

// ===============================
// 18. EVENT LISTENERS
// ===============================

typingInput.addEventListener("input", handleTyping);

startBtn.addEventListener("click", startTest);

resetBtn.addEventListener("click", resetTest);

themeBtn.addEventListener("click", toggleTheme);

infoBtn.addEventListener("click", () => {
  alert(
    "Start the test and type the displayed text as quickly and accurately as possible. ",
  );
});

// ===============================
// 19. INITIALIZE APP
// ===============================

loadTheme();

currentText = textData[0];

renderText();

typingInput.disabled = true;

lucide.createIcons();
