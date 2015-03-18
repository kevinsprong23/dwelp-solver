// SAMPLE NEW GAME

game = dwelp.Game();

game.initSimpleBoard(7, 7);
for (var i = 0; i < 3; i++) {
  for (var j = 0; j < 3; j++) {
    game.removeEmptySpace([i, j]);
  }
}
for (var i = 4; i < 7; i++) {
  for (var j = 4; j < 7; j++) {
    game.removeEmptySpace([i, j]);
  }
}

game.initSingle("blue", [0, 3]);
game.initSingle("blue", [0, 5]);
game.initSingle("blue", [1, 6]);
game.initSingle("blue", [2, 3]);
game.initSingle("blue", [4, 3]);
game.initSingle("blue", [5, 0]);
game.initSingle("blue", [6, 1]);
game.initSingle("blue", [6, 3]);

game.initSingle("orange", [0, 6]);
game.initSingle("orange", [1, 5]);
game.initSingle("orange", [3, 0]);
game.initSingle("orange", [3, 2]);
game.initSingle("orange", [3, 4]);
game.initSingle("orange", [3, 6]);
game.initSingle("orange", [5, 1]);
game.initSingle("orange", [6, 0]);

//console.log("empties: " + JSON.stringify(game.empties));
//console.log("singles: " + JSON.stringify(game.singles));
//console.log("grouped: " + JSON.stringify(game.grouped));

game.maxMoves = 6;

game.solvegame();
console.log(game.solution);
