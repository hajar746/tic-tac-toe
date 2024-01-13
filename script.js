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

// GAME CONTROL FUNC: MAKES NEW BOARD AND PLAYER, PLAYS ROUND AND PRINTS UPDATED GAMEBOARD
function gameController() {
  const board = Gameboard();
  const player = Player();

  const printNewRound = () => {
    board.printBoard();
    console.log(`${player.getActivePlayer().name}'s turn.`);
  };

  // check for 3 in a row
  const check = () => {
    // checking all rows
    if (
      board.getBoard()[0].every((val) => val.getSqValue() === "X") ||
      board.getBoard()[1].every((val) => val.getSqValue() === "X") ||
      board.getBoard()[2].every((val) => val.getSqValue() === "X")
    ) {
      console.log(`GAME OVER. ${player.getActivePlayer().name} wins!!`);
      board.printBoard();
    } else if (
      board.getBoard()[0].every((val) => val.getSqValue() === "O") ||
      board.getBoard()[1].every((val) => val.getSqValue() === "O") ||
      board.getBoard()[2].every((val) => val.getSqValue() === "O")
    ) {
      console.log(`GAME OVER. ${player.getActivePlayer().name} wins!!`);
      board.printBoard();
    } else {
      player.switchPlayerTurn();
      printNewRound();
    }
  };

  const playRound = (row, column) => {
    console.log(`${player.getActivePlayer().name} is marking a square...`);
    board.markSquare(row, column, player.getActivePlayer().marker);
    player.getActivePlayer().roundsPlayed++;
    console.log(player.getActivePlayer().roundsPlayed);

    if (player.getActivePlayer().roundsPlayed >= 3) {
      check();
    } else {
      player.switchPlayerTurn();
      printNewRound();
    }
  };

  //   start game
  printNewRound();

  return {
    playRound,
  };
}
////////////////////////////////////////////////////////////////////////////////////////////

const game = gameController();
