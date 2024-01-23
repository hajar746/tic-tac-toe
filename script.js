"use strict";
// tic tac toe -by Hajar A

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

  return {
    getBoard,
    markSquare,
  };
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// THIS IS THE VALUE OF EACH SQUARE, IT WILL BE ABLE GO ACCESS IT USING CLOSURE
function Square() {
  let squareValue = " ";

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
function Player(player1, player2) {
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
  let secondPlayer = players[1];

  const getActivePlayer = () => activePlayer;
  const getSecondPlayer = () => secondPlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  return {
    getActivePlayer,
    switchPlayerTurn,
    getSecondPlayer,
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// GAME CONTROL FUNC: MAKES NEW BOARD AND PLAYER, PLAYS ROUND, CHECKS FOR 3 IN A ROWS AND PRINTS UPDATED GAMEBOARD
function gameController() {
  const board = Gameboard();
  const player = Player();
  let gameover = false;
  // displaying result on UI
  const gameResult = document.createElement("p");

  const printWinner = () => {
    gameResult.textContent = `GAME OVER. ${
      player.getActivePlayer().name
    } wins!!`;
    gameover = true;
  };

  const checkAllSame = (arr, val) => {
    return arr.every((v) => v === val);
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
      if (
        board.getBoard()[i].every((val) => val.getSqValue() === "X") ||
        board.getBoard()[i].every((val) => val.getSqValue() === "O")
      ) {
        printWinner();
      }
      // checking columns
      if (checkAllSame(columns[i], "X") || checkAllSame(columns[i], "O")) {
        printWinner();
      }
    }
    // checking diagonally
    if (
      checkAllSame(diagonal1, "X") ||
      checkAllSame(diagonal1, "O") ||
      checkAllSame(diagonal2, "X") ||
      checkAllSame(diagonal2, "O")
    ) {
      printWinner();
    }
    // checking for a tie
    if (gameover === false && player.getActivePlayer().roundsPlayed === 5) {
      checkTie();
    }

    if (gameover === false) {
      player.switchPlayerTurn();
    }
  };

  const checkTie = () => {
    gameResult.textContent = `GAME OVER. IT'S A TIE!!`;
    gameover = true;
  };

  const playRound = (row, column) => {
    board.markSquare(row, column, player.getActivePlayer().marker);
    player.getActivePlayer().roundsPlayed++;

    if (player.getActivePlayer().roundsPlayed >= 3) {
      checkRound();
    } else {
      player.switchPlayerTurn();
    }
  };

  return {
    playRound,
    getBoard: board.getBoard,
    getActivePlayer: player.getActivePlayer,
    getSecondPlayer: player.getSecondPlayer,
    gameResult,
  };
}
////////////////////////////////////////////////////////////////////////////////////////////

// DISPLAYING THE GAME ON THE SCREEN
function ScreenController() {
  const game = gameController();
  const playerTurn = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const btnStart = document.querySelector(".btn-start");
  const btnNewGame = document.querySelector(".btn-new");
  const gameScreen = document.querySelector(".container");
  const resultScreen = gameScreen.lastElementChild;

  const updateScreen = () => {
    boardDiv.textContent = " ";

    // get the active player and updated board
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    const result = game.gameResult;
    // display active player and winner
    playerTurn.textContent = `${activePlayer.name}'s turn...`;
    result.classList.add("winner");
    resultScreen.appendChild(result);
    // updating square value in UI
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
    // getting the coordinates of square using dataset
    const selectedSqr = e.target.dataset.sqrNum;
    const selectedRow = e.target.closest("div").getAttribute("data-row-num");
    const sqrValue = e.target.closest(".cell").textContent;

    // return if not you click on gaps or square is already marked
    if (!selectedSqr || sqrValue !== " ") {
      return;
    }
    game.playRound(selectedRow, selectedSqr);
    updateScreen();
  };

  const startGame = (e) => {
    const startScreen = e.target.closest(".start-screen");
    const gameScreen = document.querySelector(".container");

    // getting player names
    const input1 = document.querySelector("#p1");
    const input2 = document.querySelector("#p2");
    game.getActivePlayer().name = input1.value || "Player 1";
    game.getSecondPlayer().name = input2.value || "Player 2";

    startScreen.style.display = "none";
    gameScreen.classList.remove("hidden");
    updateScreen();
  };

  const newGame = () => {
    location.reload();
  };

  boardDiv.addEventListener("click", clickEvents);
  btnStart.addEventListener("click", startGame);
  btnNewGame.addEventListener("click", newGame);
}
// ////////////////////////////////////////////////////////////////////////////////

ScreenController();
