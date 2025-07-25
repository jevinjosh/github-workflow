const puzzleContainer = document.getElementById("puzzle");
const newGameBtn = document.getElementById("newGameBtn");
const solveBtn = document.getElementById("solveBtn");
const statusText = document.getElementById("status");

const size = 4;
let tiles = [];
let moveCount = 0;

function createTiles() {
  tiles = Array.from({ length: size * size }, (_, i) => (i + 1) % (size * size));
  updateTiles();
}

function shuffleTiles() {
  // Start with solved then shuffle except last (empty) tile
  tiles = Array.from({ length: size * size }, (_, i) => (i + 1) % (size * size));
  let currentIndex = tiles.length - 1; // leave last one (empty) untouched

  while (currentIndex > 1) {
    const randIndex = Math.floor(Math.random() * currentIndex);
    [tiles[randIndex], tiles[currentIndex - 1]] = [tiles[currentIndex - 1], tiles[randIndex]];
    currentIndex--;
  }

  moveCount = 0;
  statusText.textContent = "Let's play!";
  updateTiles();
}

function updateTiles() {
  puzzleContainer.innerHTML = "";
  tiles.forEach((num, index) => {
    const tile = document.createElement("div");
    tile.className = "tile";
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
    updateTiles();
    moveCount++;
    if (checkWin()) {
      statusText.textContent = `🎉 You solved it in ${moveCount} moves!`;
    }
  }
}

function isAdjacent(i1, i2) {
  const x1 = i1 % size;
  const y1 = Math.floor(i1 / size);
  const x2 = i2 % size;
  const y2 = Math.floor(i2 / size);
  return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) === 1;
}

function checkWin() {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[tiles.length - 1] === 0;
}

function autoSolve() {
  tiles = Array.from({ length: size * size }, (_, i) => (i + 1) % (size * size));
  updateTiles();
  statusText.textContent = "✔️ Puzzle Solved!";
}

newGameBtn.addEventListener("click", shuffleTiles);
solveBtn.addEventListener("click", autoSolve);

createTiles();
