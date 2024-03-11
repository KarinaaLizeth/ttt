document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    const startBtn = document.getElementById('startBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    const timerDisplay = document.getElementById('timer');
    const playersList = document.getElementById('playersList');
    let currentPlayer = 'X';
    let cells = Array.from({ length: 9 });
    let timerInterval;
    let startTime;

    const renderBoard = () => {
      board.innerHTML = '';
      cells.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (value) {
          cell.classList.add(value); // Agrega la clase correspondiente a la celda
        }
        cell.dataset.index = index;
        cell.textContent = value || '';
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
      });
    };

    const handleCellClick = (event) => {
      const index = event.target.dataset.index;
      if (!cells[index]) {
        cells[index] = currentPlayer;
        renderBoard();
        if (checkWinner()) {
          const endTime = Date.now();
          clearInterval(timerInterval);
          const playerName = prompt('¡Felicidades! Has ganado. Por favor, introduce tu nombre:');
          const time = Math.floor((endTime - startTime) / 1000);
          const players = JSON.parse(localStorage.getItem('players')) || [];
          players.push({ name: playerName, time });
          players.sort((a, b) => a.time - b.time);
          localStorage.setItem('players', JSON.stringify(players.slice(0, 10)));
          renderPlayers();
          newGameBtn.style.display = 'inline';
          alert(`¡Felicidades, ${playerName}! Has ganado.`);
        } else {
          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
          if (currentPlayer === 'O') {
            setTimeout(() => {
              computerMove();
              if (checkWinner()) {
                clearInterval(timerInterval);
                renderBoard();
                alert('¡La computadora ha ganado!');
                newGameBtn.style.display = 'inline';
              } else if (cells.every(cell => cell)) {
                clearInterval(timerInterval);
                renderBoard();
                alert('¡Ha sido un empate!');
                newGameBtn.style.display = 'inline';
              }
            }, 500);
          }
        }
      }
    };

    const computerMove = () => {
      const emptyCells = cells.reduce((acc, cell, index) => {
        if (!cell) {
          acc.push(index);
        }
        return acc;
      }, []);
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      cells[emptyCells[randomIndex]] = currentPlayer;
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      renderBoard();
    };

    const checkWinner = () => {
      const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ];
      return winningCombos.some(combo => {
        const [a, b, c] = combo;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
          document.querySelector(`.cell[data-index="${a}"]`).classList.add('win');
          document.querySelector(`.cell[data-index="${b}"]`).classList.add('win');
          document.querySelector(`.cell[data-index="${c}"]`).classList.add('win');
          return true;
        }
      });
    };

    const renderPlayers = () => {
      playersList.innerHTML = '';
      const players = JSON.parse(localStorage.getItem('players')) || [];
      players.forEach(player => {
        const playerItem = document.createElement('li');
        playerItem.textContent = `${player.name}: ${player.time} segundos`;
        playersList.appendChild(playerItem);
      });
    };

    const startGame = () => {
      startBtn.style.display = 'none';
      newGameBtn.style.display = 'none';
      currentPlayer = 'X';
      cells = Array.from({ length: 9 });
      renderBoard();
      startTime = Date.now();
      timerInterval = setInterval(updateTimer, 1000);
    };

    const updateTimer = () => {
      const currentTime = Math.floor((Date.now() - startTime) / 1000);
      timerDisplay.textContent = `Tiempo: ${currentTime} segundos`;
    };

    startBtn.addEventListener('click', startGame);
    newGameBtn.addEventListener('click', startGame);

    renderPlayers();
  });