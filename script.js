const puzzleContainer = document.getElementById("grid");
const newGameBtn = document.getElementById("newGameBtn");
const solveBtn = document.getElementById("solveBtn");
const statusText = document.getElementById("status");
const moveCounterDisplay = document.getElementById("moveCounter");
const timerDisplay = document.getElementById("timer");

const size = 4;
let tiles = [];
let moveCount = 0;
let timerInterval = null;
let secondsElapsed = 0;

function createTiles() {
  tiles = Array.from({ length: size * size }, (_, i) => (i + 1) % (size * size));
  updateTiles();
  moveCount = 0;
  secondsElapsed = 0;
  updateMoveCounter();
  updateTimerDisplay();
}

function shuffleTiles() {
  tiles = Array.from({ length: size * size }, (_, i) => (i + 1) % (size * size));
  let currentIndex = tiles.length - 1;

  while (currentIndex > 1) {
    const randIndex = Math.floor(Math.random() * currentIndex);
    [tiles[randIndex], tiles[currentIndex - 1]] = [tiles[currentIndex - 1], tiles[randIndex]];
    currentIndex--;
  }

  moveCount = 0;
  secondsElapsed = 0;
  updateMoveCounter();
  updateTimerDisplay();
  startTimer();
  statusText.textContent = "Let's play!";
  updateTiles();
}

function updateTiles() {
  puzzleContainer.innerHTML = "";
  tiles.forEach((num, index) => {
    const tile = document.createElement("div");
    tile.className = "tile" + (num === 0 ? " empty" : "");
    tile.textContent = num !== 0 ? num : "";
    tile.dataset.index = index;
    tile.addEventListener("click", () => moveTile(index));
    puzzleContainer.appendChild(tile);
  });
}

function moveTile(index) {
  const emptyIndex = tiles.indexOf(0);
  const validMoves = [
    emptyIndex - 1,
    emptyIndex + 1,
    emptyIndex - size,
    emptyIndex + size
  ];

  if (validMoves.includes(index) && isAdjacent(index, emptyIndex)) {
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    moveCount++;
    updateMoveCounter();
    updateTiles();

    if (checkWin()) {
      statusText.textContent = `🎉 You solved it in ${moveCount} moves and ${secondsElapsed} seconds!`;
      stopTimer();
    }
  }
}

function isAdjacent(i1, i2) {
  const x1 = i1 % size;
  const y1 = Math.floor(i1 / size);
  const x2 = i2 % size;
  const y2 = Math.floor(i2 / size);
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
}

function checkWin() {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[tiles.length - 1] === 0;
}

function autoSolve() {
  tiles = Array.from({ length: size * size }, (_, i) => (i + 1) % (size * size));
  moveCount = 0;
  secondsElapsed = 0;
  updateMoveCounter();
  updateTimerDisplay();
  updateTiles();
  stopTimer();
  statusText.textContent = "✔️ Puzzle Solved!";
}

function updateMoveCounter() {
  const label = moveCount === 1 ? "move" : "moves";
  moveCounterDisplay.textContent = `[ ${moveCount} ${label} ]`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = `Time: ${secondsElapsed}s`;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    secondsElapsed++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

newGameBtn.addEventListener("click", shuffleTiles);
solveBtn.addEventListener("click", autoSolve);

createTiles();
