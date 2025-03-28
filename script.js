class Minesweeper {
    constructor(gridSize = 10, mineCount = 10) {
        this.gridSize = gridSize;
        this.mineCount = mineCount;
        this.grid = [];
        this.gameOver = false;
        this.timer = 0;
        this.timerInterval = null;
        this.init();
    }

    init() {
        this.createGrid();
        this.placeMines();
        this.calculateNumbers();
        this.setupEventListeners();
        this.updateMineCount();
        this.startTimer();
    }

    createGrid() {
        const gridElement = document.getElementById('grid');
        gridElement.innerHTML = '';
        this.grid = [];

        for (let i = 0; i < this.gridSize; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.gridSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                gridElement.appendChild(cell);
                this.grid[i][j] = {
                    element: cell,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborMines: 0
                };
            }
        }
    }

    placeMines() {
        let minesPlaced = 0;
        while (minesPlaced < this.mineCount) {
            const row = Math.floor(Math.random() * this.gridSize);
            const col = Math.floor(Math.random() * this.gridSize);
            if (!this.grid[row][col].isMine) {
                this.grid[row][col].isMine = true;
                minesPlaced++;
            }
        }
    }

    calculateNumbers() {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (!this.grid[i][j].isMine) {
                    this.grid[i][j].neighborMines = this.countNeighborMines(i, j);
                }
            }
        }
    }

    countNeighborMines(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < this.gridSize &&
                    newCol >= 0 && newCol < this.gridSize &&
                    this.grid[newRow][newCol].isMine) {
                    count++;
                }
            }
        }
        return count;
    }

    setupEventListeners() {
        document.getElementById('grid').addEventListener('click', (e) => this.handleClick(e));
        document.getElementById('grid').addEventListener('contextmenu', (e) => this.handleRightClick(e));
        document.getElementById('new-game-btn').addEventListener('click', () => this.resetGame());
    }

    handleClick(e) {
        if (this.gameOver) return;
        const cell = e.target;
        if (!cell.classList.contains('cell')) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        if (this.grid[row][col].isFlagged) return;
        
        if (this.grid[row][col].isMine) {
            this.revealMines();
            this.endGame(false);
        } else {
            this.revealCell(row, col);
            if (this.checkWin()) {
                this.endGame(true);
            }
        }
    }

    handleRightClick(e) {
        e.preventDefault();
        if (this.gameOver) return;
        
        const cell = e.target;
        if (!cell.classList.contains('cell')) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        if (!this.grid[row][col].isRevealed) {
            this.grid[row][col].isFlagged = !this.grid[row][col].isFlagged;
            cell.classList.toggle('flagged');
            this.updateMineCount();
        }
    }

    revealCell(row, col) {
        const cell = this.grid[row][col];
        if (cell.isRevealed || cell.isFlagged) return;

        cell.isRevealed = true;
        cell.element.classList.add('revealed');

        if (cell.neighborMines > 0) {
            cell.element.textContent = cell.neighborMines;
        } else {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;
                    if (newRow >= 0 && newRow < this.gridSize &&
                        newCol >= 0 && newCol < this.gridSize) {
                        this.revealCell(newRow, newCol);
                    }
                }
            }
        }
    }

    revealMines() {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j].isMine) {
                    this.grid[i][j].element.classList.add('mine');
                }
            }
        }
    }

    checkWin() {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (!this.grid[i][j].isMine && !this.grid[i][j].isRevealed) {
                    return false;
                }
            }
        }
        return true;
    }

    endGame(won) {
        this.gameOver = true;
        clearInterval(this.timerInterval);
        alert(won ? 'Congratulations! You won!' : 'Game Over!');
    }

    resetGame() {
        clearInterval(this.timerInterval);
        this.gameOver = false;
        this.timer = 0;
        document.getElementById('timer').textContent = '0';
        this.init();
    }

    updateMineCount() {
        let flaggedCount = 0;
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j].isFlagged) flaggedCount++;
            }
        }
        document.getElementById('mine-count').textContent = this.mineCount - flaggedCount;
    }

    startTimer() {
        this.timer = 0;
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timer++;
            document.getElementById('timer').textContent = this.timer;
        }, 1000);
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Minesweeper();
});