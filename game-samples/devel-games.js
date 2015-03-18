//******************************************************************************
// EXAMPLE GAMES

// puzzle 1
var gameOne = function() {
  // vars to hold board
  var empties = [];
  var singles = {};
  var grouped = {};

  initSimpleBoard(empties, 5, 5);
  initSingle(empties, singles, "blue", [0, 3]);
  initSingle(empties, singles, "blue", [1, 0]);
  initSingle(empties, singles, "blue", [3, 4]);
  initSingle(empties, singles, "blue", [4, 1]);

  console.log("empties: " + JSON.stringify(empties));
  console.log("singles: " + JSON.stringify(singles));
  console.log("grouped: " + JSON.stringify(grouped));

  solve(0, 5, "", empties, singles, grouped, false, "");
}

// another simple single color game
var gameTwo = function() {
  // vars to hold board
  var empties = [];
  var singles = {};
  var grouped = {};

  initSimpleBoard(empties, 4, 4);
  initSingle(empties, singles, "blue", [0, 0]);
  initSingle(empties, singles, "blue", [3, 3]);
  initSingle(empties, singles, "blue", [3, 0]);
  initSingle(empties, singles, "blue", [0, 3]);

  console.log("empties: " + JSON.stringify(empties));
  console.log("singles: " + JSON.stringify(singles));
  console.log("grouped: " + JSON.stringify(grouped));

  solve(0, 5, "", empties, singles, grouped, false, "");
}

// a simple multi color game
var gameThree = function() {
  // vars to hold board
  var empties = [];
  var singles = {};
  var grouped = {};

  initSimpleBoard(empties, 5, 3);
  initSingle(empties, singles, "blue", [0, 0]);
  initSingle(empties, singles, "blue", [0, 2]);
  initSingle(empties, singles, "blue", [3, 1]);
  initSingle(empties, singles, "orange", [4, 0]);
  initSingle(empties, singles, "orange", [4, 2]);
  initSingle(empties, singles, "orange", [1, 1]);

  console.log("empties: " + JSON.stringify(empties));
  console.log("singles: " + JSON.stringify(singles));
  console.log("grouped: " + JSON.stringify(grouped));

  solve(0, 2, "", empties, singles, grouped, false, "");

}

var game61 = function() {
  // vars to hold board
  var empties = [];
  var singles = {};
  var grouped = {};
  // this board is trickier
  initSimpleBoard(empties, 7, 7);
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      empties.pSplice([i, j]);
    }
  }
  for (var i = 4; i < 7; i++) {
    for (var j = 4; j < 7; j++) {
      empties.pSplice([i, j]);
    }
  }

  initSingle(empties, singles, "blue", [0, 3]);
  initSingle(empties, singles, "blue", [0, 5]);
  initSingle(empties, singles, "blue", [1, 6]);
  initSingle(empties, singles, "blue", [2, 3]);
  initSingle(empties, singles, "blue", [4, 3]);
  initSingle(empties, singles, "blue", [5, 0]);
  initSingle(empties, singles, "blue", [6, 1]);
  initSingle(empties, singles, "blue", [6, 3]);

  initSingle(empties, singles, "orange", [0, 6]);
  initSingle(empties, singles, "orange", [1, 5]);
  initSingle(empties, singles, "orange", [3, 0]);
  initSingle(empties, singles, "orange", [3, 2]);
  initSingle(empties, singles, "orange", [3, 4]);
  initSingle(empties, singles, "orange", [3, 6]);
  initSingle(empties, singles, "orange", [5, 1]);
  initSingle(empties, singles, "orange", [6, 0]);

  console.log("empties: " + JSON.stringify(empties));
  console.log("singles: " + JSON.stringify(singles));
  console.log("grouped: " + JSON.stringify(grouped));

  solve(0, 6, "", empties, singles, grouped, false, "");
}

