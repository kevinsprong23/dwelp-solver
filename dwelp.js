var dwelp = function dwelpSolver() {

  //******************************************************************************
  // TUPLE UTILS

  // custom indexOf for tuples
  Array.prototype.pIndexOf = function(pos) {
    for (var i = 0; i < this.length; i++) {
      if (this[i][0] === pos[0] && this[i][1] === pos[1]) {
        return i;
      }
    }
    return -1;
  }

  // remove a tuple from an array of tuples
  Array.prototype.pSplice = function(pos) {
    var idx = this.pIndexOf(pos);
    if (idx !== -1) {
      this.splice(idx, 1);
    }
  }

  // equals for tuples
  var peq = function(pos1, pos2) {
    return pos1[0] === pos2[0] && pos1[1] === pos2[1];
  }

  // find shift needed to get pos1 to pos2
  var findOffset = function(pos1, pos2) {
    return [pos2[0] - pos1[0], pos2[1] - pos1[1]];
  }

  // move a tuple by a certain number of squares
  var translate = function(pos, offset) {
    return [pos[0] + offset[0], pos[1] + offset[1]];
  }

  // find dist between two tuples - taxicab norm
  var dist = function(pos1, pos2) {
    return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
  }

  // single-level deep copy of an object
  var copyOf = function(obj) {
    var clone = {};
    for (key in obj) {
      clone[key] = [];
      for (var i = 0; i < obj[key].length; i++) {
        clone[key].push(obj[key][i]);
      }
    }
    return clone;
  }

  //******************************************************************************
  // GAME LOGIC

  // if there are no singles of any color left, we win
  var weWin = function(remainingSingles) {
    for (col in remainingSingles) {
      if (remainingSingles[col].length > 0) {
        return false;
      }
    }
    return true;
  }

  // see if moving tiles of color col, such that (tiles[0] -> to),
  // is legal on a given board
  // singleTiles has already been filtered by color here
  var isLegalMove = function(tiles, to, emptyTiles, singleTiles) {
    // if to square isn't empty, fail fast
    if (emptyTiles.pIndexOf(to) === -1) {
      return false;
    }
    // else check each squares availability
    var offset = findOffset(tiles[0], to);
    var hasAdjacentSingle = false;
    for (var i = 0; i < tiles.length; i++) {
      var target = translate(tiles[i], offset);
      if (emptyTiles.pIndexOf(target) === -1) {
        return false;
      }
      // and that we are moving adjacent to 1+ same-color single tiles
      if (!hasAdjacentSingle) {
        for (var j = 0; j < singleTiles.length; j++) {
          // ignore current move tile if this happens to be a single
          if (!(tiles.length === 1 && peq(tiles[i], singleTiles[j])) &&
              dist(target, singleTiles[j]) === 1) {
            hasAdjacentSingle = true;
            break;
          }
        }
      }
    }
    // if we get here, can return whether we found an adjacent single
    return hasAdjacentSingle;
  }

  // find ALL adjacent singles. worse performance than the similar code in
  // findLegalMove (that version stops on first success)
  // again singleTiles has been split off by color and is an array of tuples
  var findAdjacentSingles = function(tiles, to, singleTiles) {
    var adjacents = [];
    var offset = findOffset(tiles[0], to);
    for (var i = 0; i < tiles.length; i++) {
      var target = translate(tiles[i], offset);
      // and that we are moving adjacent to 1+ same-color single tiles
      for (var j = 0; j < singleTiles.length; j++) {
        // ignore current move tile if this happens to be a single
        if (!(tiles.length === 1 && peq(tiles[i], singleTiles[j])) &&
            dist(target, singleTiles[j]) === 1) {
          adjacents.push(singleTiles[j]);
        }
      }
    }
    return adjacents;
  }

  // execute a given move
  var moveTiles = function(color, tiles, to,
                           emptyTiles, singleTiles, groupedTiles) {
    // first make copies of all arrays
    newEmpties = emptyTiles.concat(tiles); // add newly vacated tiles
    newSingles = copyOf(singleTiles);
    newGrouped = copyOf(groupedTiles);

    var idx = -1;
    // remove translated positions from empties
    var offset = findOffset(tiles[0], to);
    for (var i = 0; i < tiles.length; i++) {
      var target = translate(tiles[i], offset);
      idx = newEmpties.pIndexOf(target);
      newEmpties.splice(idx, 1);
    }

    // remove tile from singleTiles, if applicable
    // create color key and add tile to groupedTiles, if applicable
    if (tiles.length === 1) {
      newSingles[color].pSplice(tiles[0]);
      newGrouped[color] = tiles;
    }

    // update positions in groups
    newGroupPositions = []
    for (var i = 0; i < newGrouped[color].length; i++) {
      newGroupPositions.push(translate(newGrouped[color][i], offset));
    }
    newGrouped[color] = newGroupPositions;

    // remove any same-color adjacent tiles from singleTiles
    // and add them to groupedTiles
    var adjacents = findAdjacentSingles(tiles, to, singleTiles[color]);
    for (var i = 0; i < adjacents.length; i++) {
      newSingles[color].pSplice(adjacents[i]);
      newGrouped[color].push(adjacents[i]);
    }

    // return copied objects
    return {empties: newEmpties, singles: newSingles, groups: newGrouped};
  }

  // only call this in alternating colors mode
  var getNextForcedColor = function(col) {
     return (col === "red") ? "green" : "red";
  }

  // recursively find, and assign to parent object, a solution to a game
  var solve = function(move, maxMoves, moveChain, empties,
                       singles, groups, alternatingColors, forcedColor) {
    if (move >= maxMoves) {
      return false;
    }

    // find all legal moves and branch
    legalColors = [];
    for (key in singles) {
      if (singles[key].length > 0) {
        legalColors.push(key);
      }
    }

    // find just one solution
    var foundSolution = false;
    for (var i = 0; i < legalColors.length; i++) {
      var col = legalColors[i];
      if (forcedColor.length > 0 && col !== forcedColor) {
        continue;
      }
      for (var j = 0; j < empties.length; j++) {
        var cand = empties[j];
        var sources = [];
        // decide whether to pull candidate moves from groups or singles
        if (groups.hasOwnProperty(col) && groups[col].length > 0) {
          sources.push(groups[col]);  // array wrapping the groups array
        } else {
          for (var k = 0; k < singles[col].length; k++) {
            sources.push([singles[col][k]]);  // individually wrapped elements
          }
        }
        for (var k = 0; k < sources.length; k++) {
          var src = sources[k];
          if (isLegalMove(src, cand, empties, singles[col])) {
            updatedState = moveTiles(col, src, cand, empties, singles, groups);
            var nextMoveStr = JSON.stringify(src[0]) + "->" + JSON.stringify(cand);
            
            if (weWin(updatedState.singles)) {
              moveChain += nextMoveStr;
              this.solution = moveChain;
              return true;
            } else {
              var nextCol = (alternatingColors) ? getNextForcedColor(col) : "";
              // recursion
              foundSolution = foundSolution | this.solve(move + 1, maxMoves,
                                                  moveChain + nextMoveStr + ",",
                                                  updatedState.empties,
                                                  updatedState.singles,
                                                  updatedState.groups,
                                                  alternatingColors,
                                                  nextCol);
            }
          }
        }
        // might succeed fast once we have checked this round of sources
        if (foundSolution) {
          return true;
        }     
      }
    }
  }

  //******************************************************************************
  // BOARD INIT

  // add squares to a board
  var initSimpleBoard = function(nrow, ncol) {
    for (var i = 0; i < nrow; i++) {
      for (var j = 0; j < ncol; j++) {
        this.empties.push([i, j]);
      }
    }
  }

  // add an empty space to a board
  var addEmptySpace = function(pos) {
    var idx = this.empties.pIndexOf(pos);
    if (idx === -1) {
      this.empties.push(pos);
    }
  }

  // remove an empty space from a board
  var removeEmptySpace = function(pos) {
    this.empties.pSplice(pos);
  }

  // add initial tiles to a board
  var initSingle = function(color, pos) {
    // add to singles
    if (this.singles.hasOwnProperty(color)) {
      this.singles[color].push(pos);
    } else {
      this.singles[color] = [pos];
    }
    // remove from empties
    this.removeEmptySpace(pos);
  }

  // wrapper for recursive solve call; populates this.solution
  var solvegame = function() {
    // needs to be this ugly so obj copies can be passed in recursive calls
    this.solve(this.move, this.maxMoves, "", this.empties, this.singles,
               this.groups, this.alternatingColors, this.forcedColor);
  }

  // game constructor
  var Game = function() {
    return { empties: [],
             singles: {},
             groups: {},
             move: 0,
             maxMoves: 0,
             alternatingColors: false,
             forcedColor: "",
             initSimpleBoard: initSimpleBoard,
             addEmptySpace: addEmptySpace,
             removeEmptySpace: removeEmptySpace,
             initSingle: initSingle,
             solve: solve,
             solvegame: solvegame,
             solution: ""
           };
  }

  //******************************************************************************
  // DWELP object
  var dwelp = { Game : Game };
  return dwelp;
}();
