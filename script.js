"use strict";

// FACTORY FUNC TO: MAKE BOARD, GET BOARD, PRINT BOARD WITH UPDATED VALUES AND A FUNCTION TO MARK A SQUARE
function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Square());
    }
  }

  const getBoard = () => board;
  //   find position in board and mark it
  const markSquare = (row, column, marker) => {
    board[row][column].addMarker(marker);
  };
  //   maps board into a new board with all of its values
  const printBoard = () => {
    const updatedBoard = board.map((row) =>
      row.map((square) => square.getSqValue())
    );
    console.log(updatedBoard);
  };

  return {
    getBoard,
    markSquare,
    printBoard,
  };
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// THIS IS THE VALUE OF EACH SQUARE, IT WILL BE ABLE GO ACCESS IT USING CLOSURE
function Square() {
  let squareValue = "0";

  const addMarker = (marker) => {
    squareValue = marker;
  };
  const getSqValue = () => squareValue;

  return {
    addMarker,
    getSqValue,
  };
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PLAYER FACTORY FUNC: STORES PLAYER OBJECTS, STORES ACTIVE PLAYER, GETS ACTIVE PLAYER AND SWITCHS PLAYERS TURN
function Player(player1 = "Player 1", player2 = "Player 2") {
  const players = [
    {
      name: player1,
      marker: "X",
      roundsPlayed: 0,
    },
    {
      name: player2,
      marker: "O",
      roundsPlayed: 0,
    },
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  return {
    getActivePlayer,
    switchPlayerTurn,
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// GAME CONTROL FUNC: MAKES NEW BOARD AND PLAYER, PLAYS ROUND, CHECKS FOR 3 IN A ROWS AND PRINTS UPDATED GAMEBOARD
function gameController() {
  const board = Gameboard();
  const player = Player();
  let gameover = false;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${player.getActivePlayer().name}'s turn.`);
  };

  const checkRound = () => {
    let columns = [[], [], []];
    let diagonal1 = [];
    let diagonal2 = [];

    // getting column values
    for (let i = 0; i < 3; i++) {
      const eachRow = board.getBoard()[i];
      for (let i = 0; i < 3; i++) {
        columns[i].push(eachRow[i].getSqValue());
      }
    }

    // getting diagonal values
    for (let i = 0; i < 3; i++) {
      const eachRow = board.getBoard()[i];
      diagonal1.push(eachRow[i].getSqValue());
    }
    diagonal2.push(board.getBoard()[0][2].getSqValue());
    diagonal2.push(board.getBoard()[1][1].getSqValue());
    diagonal2.push(board.getBoard()[2][0].getSqValue());

    for (let i = 0; i < 3; i++) {
      // checking rows
      if (board.getBoard()[i].every((val) => val.getSqValue() === "X")) {
        console.log(`GAME OVER. ${player.getActivePlayer().name} wins!!`);
        board.printBoard();
        gameover = true;
      }
      if (board.getBoard()[i].every((val) => val.getSqValue() === "O")) {
        console.log(`GAME OVER. ${player.getActivePlayer().name} wins!!`);
        board.printBoard();
        gameover = true;
      }
      // checking columns
      if (columns[i].every((val) => val === "X")) {
        console.log(`GAME OVER. ${player.getActivePlayer().name} wins!!`);
        board.printBoard();
        gameover = true;
      }
      if (columns[i].every((val) => val === "O")) {
        console.log(`GAME OVER. ${player.getActivePlayer().name} wins!!`);
        board.printBoard();
        gameover = true;
      }
    }
    // checking diagonally
    if (diagonal1.every((val) => val === "X")) {
      console.log(`GAME OVER. ${player.getActivePlayer().name} wins!!`);
      board.printBoard();
      gameover = true;
    }
    if (diagonal1.every((val) => val === "O")) {
      printWinner();
      gameover = true;
    }
    if (diagonal2.every((val) => val === "X")) {
      console.log(`GAME OVER. ${player.getActivePlayer().name} wins!!`);
      board.printBoard();
      gameover = true;
    }
    if (diagonal2.every((val) => val === "O")) {
      console.log(`GAME OVER. ${player.getActivePlayer().name} wins!!`);
      board.printBoard();
      gameover = true;
    }
    // checking for a tie
    if (gameover === false && player.getActivePlayer().roundsPlayed === 5) {
      checkTie();
    }

    if (gameover === false) {
      player.switchPlayerTurn();
      printNewRound();
    }
  };

  const checkTie = () => {
    console.log(`GAME OVER. IT'S A TIE!!`);
    gameover = true;
  };

  const playRound = (row, column) => {
    console.log(`${player.getActivePlayer().name} is marking a square...`);
    board.markSquare(row, column, player.getActivePlayer().marker);
    player.getActivePlayer().roundsPlayed++;
    console.log(player.getActivePlayer().roundsPlayed);

    if (player.getActivePlayer().roundsPlayed >= 3) {
      checkRound();
    } else {
      player.switchPlayerTurn();
      printNewRound();
    }
  };

  //   start game
  printNewRound();

  return {
    playRound,
    getBoard: board.getBoard,
    getActivePlayer: player.getActivePlayer,
  };
}
////////////////////////////////////////////////////////////////////////////////////////////

// DISPLAYING THE GAME ON THE SCREEN
function ScreenController() {
  const game = gameController();
  const playerTurn = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    boardDiv.textContent = " ";

    // get the active player and updated board
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    // display active player
    playerTurn.textContent = `${activePlayer.name}'s turn...`;
    board.forEach((row, i) => {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");
      rowDiv.dataset.rowNum = i;
      boardDiv.appendChild(rowDiv);
      row.forEach((square, i) => {
        const squareBtn = document.createElement("button");
        squareBtn.classList.add("cell");
        squareBtn.dataset.sqrNum = i;
        squareBtn.textContent = square.getSqValue();
        rowDiv.appendChild(squareBtn);
      });
    });
  };
  const clickEvents = (e) => {
    const selectedSqr = e.target.dataset.sqrNum;
    const selectedRow = e.target.closest("div").getAttribute("data-row-num");
    if (!selectedSqr) {
      return;
    }
    game.playRound(selectedRow, selectedSqr);
    updateScreen();
  };

  boardDiv.addEventListener("click", clickEvents);
  updateScreen();
}

ScreenController();
