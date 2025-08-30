const cols = 10;
const rows = 15;
const minesTotal = 30;
let board = [];
let flagsPlaced = 0;

const boardEl = document.getElementById('board');
const minesEl = document.getElementById('mines');
const resetBtn = document.getElementById('reset');

function init() {
  board = [];
  flagsPlaced = 0;
  boardEl.innerHTML = '';
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const cell = {
        r,
        c,
        mine: false,
        revealed: false,
        flag: false,
        adjacent: 0,
        el: document.createElement('div')
      };
      cell.el.classList.add('cell');
      cell.el.dataset.r = r;
      cell.el.dataset.c = c;
      cell.el.addEventListener('click', () => revealCell(r, c));
      cell.el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFlag(r, c);
      });
      boardEl.appendChild(cell.el);
      row.push(cell);
    }
    board.push(row);
  }
  placeMines();
  calculateNumbers();
  updateMines();
}

function placeMines() {
  let placed = 0;
  while (placed < minesTotal) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }
}

function calculateNumbers() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
            count++;
          }
        }
      }
      board[r][c].adjacent = count;
    }
  }
}

function revealCell(r, c) {
  const cell = board[r][c];
  if (cell.revealed || cell.flag) return;
  cell.revealed = true;
  cell.el.classList.add('revealed');

  if (cell.mine) {
    cell.el.classList.add('mine');
    revealAllMines();
    alert('Game Over');
    return;
  }

  if (cell.adjacent > 0) {
    cell.el.textContent = cell.adjacent;
    cell.el.classList.add('n' + cell.adjacent);
  } else {
    // reveal neighbors
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (!board[nr][nc].revealed) revealCell(nr, nc);
        }
      }
    }
  }
  checkWin();
}

function toggleFlag(r, c) {
  const cell = board[r][c];
  if (cell.revealed) return;
  cell.flag = !cell.flag;
  cell.el.classList.toggle('flag');
  flagsPlaced += cell.flag ? 1 : -1;
  updateMines();
}

function revealAllMines() {
  for (const row of board) {
    for (const cell of row) {
      if (cell.mine) {
        cell.el.classList.add('mine', 'revealed');
      }
    }
  }
}

function checkWin() {
  let revealedCount = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.revealed) revealedCount++;
    }
  }
  if (revealedCount === rows * cols - minesTotal) {
    revealAllMines();
    alert('You win!');
  }
}

function updateMines() {
  minesEl.textContent = `Mines: ${minesTotal - flagsPlaced}`;
}

resetBtn.addEventListener('click', init);
window.addEventListener('load', init);

