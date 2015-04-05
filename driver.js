// function called only for display purposes on clicks
function getFillColor(mode) {
  if (mode === "empty") {
    return "#f7f7f5";
  } else if (mode === "blue") {
    return "#268bd2";
  } else if (mode === "orange") {
    return "#eb8b16";
  } else if (mode === "purple") {
    return "#6c71c4";
  } else if (mode === "green") {
    return "#859900";
  } else if (mode === "red") {
    return "#dc322f";
  } else if (mode === "bg") {
    return "#f7f7f5";
  } else {  // it is a multi-tile
    return 'url(#' + mode + ')';
  }
}

// handle the driver's game data structures on mouse click
function processSpace(d, i) {
  var coordinates = [d.row, d.col];
  // what happens next depends on global mode
  
  var curModes = mode.split("-");  // multitiles are "-" delimited
  d3.select("#mode").text(JSON.stringify(curModes));
  
  if (curModes.length === 1) {
    var thisMode = curModes[0];
    var array = [];
    if (thisMode === "empty") {
      array = empties;
    } else {
      if (!singles.hasOwnProperty(mode)) {
        singles[mode] = [];
      }
      array = singles[mode];
    }

    var idx = array.pIndexOf(coordinates);  // dwelp.js augments prototype

    // toggle existence in array 
    if (idx === -1) {
      d3.select("#circle_" + i)
        .attr("stroke", "#777")
        .attr("stroke-width", function(){return (thisMode === "empty") ? "1px" : "2px";})
        .attr("fill", getFillColor(mode))
        .attr("opacity", 0.8);
      array.push(coordinates);   
      // remove from any other arrays it might have been in
      for (key in singles) {
        if (singles[key] !== array) {
          singles[key].pSplice(coordinates);  // another prototype augment
        }
      }
      for (key in multies) {
        multies[key].pSplice(coordinates);
      }
      if (thisMode !== "empty") {
        empties.pSplice(coordinates); 
      } 
    } else {
      d3.select("#circle_" + i)
        .attr("stroke", "#eee")
        .attr("stroke-width", "1px")
        .attr("fill", getFillColor("bg"))
        .attr("opacity", 0.2);
      array.pSplice(coordinates); 
    }   
  } else {
    for (var j = 0; j < curModes.length; j++) {
      var thisMode = curModes[j];
      array = multies[thisMode];
      var idx = array.pIndexOf(coordinates);
      // toggle existence in array 
      if (idx === -1) {
        // here we want to select second row
        d3.select("#circle_" + i)
          .attr("stroke", "#000")
          .attr("stroke-width", "2px")
          .attr("fill", getFillColor(mode))
          .attr("opacity", 0.8);
        array.push(coordinates);   
        empties.pSplice(coordinates); 
        // remove from any other arrays it might have been in
        for (key in singles) {
          if (singles[key] !== array) {
            singles[key].pSplice(coordinates);  // another prototype augment
          }
        }
        for (key in multies) {
          // here we need to check if current color is involved
          if (curModes.pIndexOf(key) === -1) {
            multies[key].pSplice(coordinates);
          }
        }
      } else {
        // TODO this one is complicated. For now multis can overwrite but not erase.
      }
    }
  }
  
  //d3.select("#empties").text("empties: " + JSON.stringify(empties));
  //d3.select("#singles").text("singles: " + JSON.stringify(singles));
  //d3.select("#multies").text("multies: " + JSON.stringify(multies));
}

// hold driver's game data structures while we build
var mode = "empty";

var empties = [];
var singles = {'blue':[], 'orange':[], 'purple':[], 'red': [], 'green': []};
var multies = {'blue':[], 'orange':[], 'purple':[], 'green': [], 'red': []};

// set up grid on screen
var gridDim = 9;
var canvSize = 500;

var spaceType = 'empty';

var svg = d3.select("#svg")
  .append("svg")
    .attr("width", canvSize)
    .attr("height", canvSize)
  .append("g");

// need n-1 lines for n grid spaces
var xs = d3.range(canvSize/gridDim, canvSize + 0.1, canvSize/gridDim);

// for circles
var cr = 0.48 * canvSize / gridDim;
var cxs = [];
for (var i = 0; i < xs.length; i++) {
  for (var j = 0; j < xs.length; j++) {
    cxs.push({row: i, col: j, cy: xs[i] - cr, cx: xs[j] - cr});
  }
}

// horizontal lines of grid
svg.selectAll(".horizontalGrid")
    .data(xs)
  .enter()
    .append("line")
    .attr({"x1" : 0,
           "x2" : canvSize,
           "y1" : function(d){return d;},
           "y2" : function(d){return d;},
           "fill" : "none",
           "shape-rendering" : "crispEdges",
           "stroke" : "#bbb",
           "opacity" : 0.4,
           "stroke-width" : "2px"});

// vertical line
svg.selectAll(".verticalGrid")
    .data(xs)
  .enter()
    .append("line")
    .attr({"x1" : function(d){return d;},
           "x2" : function(d){return d;},
           "y1" : 0,
           "y2" : canvSize,
           "fill" : "none",
           "shape-rendering" : "crispEdges",
           "stroke" : "#bbb",
           "opacity" : 0.4,
           "stroke-width" : "2px"});

svg.selectAll(".boardcircles")
    .data(cxs)
  .enter()
    .append("circle")
    .attr({"id" : function(d, i) { return "circle_" + i; },
           "class" : "boardcircle",
           "cx" : function(d){return d.cx;},
           "cy" : function(d){return d.cy;},
           "r" : cr,
           "fill": "#eee",
           "stroke" : "#eee",
           "opacity" : 0.2,
           "stroke-width" : "1px"})
    .on("click", processSpace);

// MENU TO CHANGE MODE

// function to fill in multi-Tile circles
var buildTripleGradient = function(id, col1, col2, col3) {
  var gradient = svg.append("svg:defs")
      .append("svg:linearGradient")
      .attr("id", id)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");
  gradient.append("svg:stop")
      .attr("offset", "0%")
      .attr("stop-color", col1)
      .attr("stop-opacity", 1);
  gradient.append("svg:stop")
      .attr("offset", "50%")
      .attr("stop-color", col2)
      .attr("stop-opacity", 0.75);
  gradient.append("svg:stop")
      .attr("offset", "100%")
      .attr("stop-color", col3)
      .attr("stop-opacity", 1);
}

buildTripleGradient("blue-orange", getFillColor("blue"), getFillColor("bg"), getFillColor("orange"));
buildTripleGradient("blue-purple", getFillColor("blue"), getFillColor("bg"), getFillColor("purple"));
buildTripleGradient("blue-green", getFillColor("blue"), getFillColor("bg"), getFillColor("green"));
buildTripleGradient("orange-green", getFillColor("orange"), getFillColor("bg"), getFillColor("green"));
buildTripleGradient("blue-orange-purple", getFillColor("blue"), getFillColor("orange"), getFillColor("purple"));

var nMenuCol = 6;
var nMenuRow = 2;  

function changeMode(d, i) {
  mode = d.mode; 
  d3.selectAll(".menucircle").attr("opacity", 0.8);
  d3.select("#menucircle_" + i).attr("opacity", 1);
}

menuItems = [];
itemNames = ["empty", "blue", "orange", "purple", "green", "red"];
multiNames = ["blue-orange", "blue-purple", "blue-green", "orange-green", "blue-orange-purple"];
for (var j = 0; j < itemNames.length; j++) {
  menuItems.push({type: "single", mode: itemNames[j], cy: canvSize / gridDim - cr, cx: xs[j] - cr});
}   
for (var j = 0; j < multiNames.length; j++) {
  menuItems.push({type: "multi", mode: multiNames[j], cy: 2 * canvSize / gridDim - cr, cx: xs[j] - cr});
}   

var svgMenu = d3.select("#svg-menu")
  .append("svg")
    .attr("width", nMenuCol * canvSize / gridDim)
    .attr("height", nMenuRow * canvSize / gridDim)
  .append("g");

svgMenu.selectAll(".menucircles")
    .data(menuItems)
  .enter()
    .append("circle")
    .attr({"id" : function(d, i) { return "menucircle_" + i; },
           "class" : "menucircle",
           "cx" : function(d){return d.cx;},
           "cy" : function(d){return d.cy;},
           "r" : 0.8 * cr,
           "fill": function(d){return getFillColor(d.mode);},
           "opacity" : 1,
           "stroke" : "#aaa",
           "stroke-width" : "2px"})
    .on("click", changeMode);


// reset the whole plot situation
var resetCurrentSetup = function() {
  empties = [];
  singles = {};
  multies = {'blue':[], 'orange':[], 'purple':[], 'green': [], 'red': []};
  
  d3.select("#movecount").property("value", "");
  
  d3.selectAll(".menucircle")
    .attr("opacity", 1);
  d3.selectAll(".boardcircle")
    .attr({"fill" : "#eee",
           "stroke" : "#eee",
           "opacity" : 0.2});
  
  clearResults();
}

// ****************************************************************************
// GAME HANDLING AND SOLVER MAGIC HAPPENS HERE

var checkForAlternatingMode = function() {
  if (!(singles.hasOwnProperty('red') && singles.hasOwnProperty('green'))) {
    //console.log("false:  needs red/green");
    return false; 
  }
  
  for (key in singles) {
    if ((key === 'red' || key === 'green')) {
      if(singles[key].length === 0) {
        //console.log("false: red/green empty");
        return false;
      }
    } else {
      if(singles[key].length > 0) {
        //console.log("false: key " + key + " exists");
        return false;
      }
    }
  }
  return true;
}

// quickie to clear results lines + text
var clearResults = function() {
  svg.selectAll(".resultslines").data([]).exit().remove();
  d3.select("#solution").text("");
}

// move to the next element with wrap around
var toggle = function(array, el) {
  var idx = array.indexOf(el);
  return (idx === array.length - 1) ? array[0] : array[idx + 1];
}

// solution looks like [3,2]->[3,1]:[0,0]->[0,1]
var plotSolution = function(solution) {
  if (solution.length === 0) {
    return;
  }
  
  var colors = ["#dc322f", "#268bd2", "#859900"];
  var offsets = [-10, 0, 10, 5];
  var color = "#859900";
  var offset = -10;
  // populate move list
  var moves = solution.split(":");
  var prevEnd = "",
      spaces = [],
      start = [],
      end = [],
      moveList  = [];
  for (var i = 0; i < moves.length; i++) {
    spaces = moves[i].split("->");
    if (spaces[0] !== prevEnd) {
      color = toggle(colors, color);
      offset = toggle(offsets, offset);
    }
    
    start = JSON.parse(spaces[0]);
    end = JSON.parse(spaces[1]);
    moveList.push({x1: xs[start[1]] - cr, y1: xs[start[0]] - cr, 
                   x2: xs[end[1]] - cr, y2: xs[end[0]] - cr,
                   color: color, offset: offset});
    
    prevEnd = spaces[1];
  }
  
  // now plot it
  var g = svg.selectAll(".resultslines")
      .data(moveList)
    .enter()
      .append("g")
      .attr("class", "resultslines");
  
  g.append("line")
      .attr({"x1" : function(d){return d.x1;},
             "x2" : function(d){return d.x2;},
             "y1" : function(d){return d.y1;},
             "y2" : function(d){return d.y2;},
             "fill" : "none",
             "shape-rendering" : "crispEdges",
             "stroke" : function(d){return d.color;},
             "opacity" : 0.9,
             "stroke-width" : "2px"});
  
  g.append("text")
      .text(function(d, i) {return (i + 1) + "."})
      .attr({"x" : function(d){return 0.5 * d.x1 + 0.5 * d.x2 + d.offset;},
             "y" : function(d){return 0.5 * d.y1 + 0.5 * d.y2 + d.offset;},
             "fill" : function(d){return d.color;},
             "font-size" : 18,
             "stroke" : function(d){return d.color;}});
  
}

var solveCurrentSetup = function() {
  // super rudimentary, non-robust error checking
  if (empties.length === 0) {
    d3.select("#solution").text("Invalid game: no empty tiles");
    return 0;
  }
  var hasSingles = false;
  for (key in singles) {
    if (singles[key].length > 1 || (singles[key].length == 1 && multies[key].length >= 1)) {
      hasSingles = true;
      break;
    }
  }
  if (!hasSingles) {
    d3.select("#solution").text("Invalid game: fewer than two elements of a color");
    return 0;
  }
  
  // create a Game
  var game = dwelp.Game();
  
  // set parameters based on driver variables (rest are set in constructor)
  game.empties = empties.slice();
  game.singles = game.copyGameInput(singles);
  game.multies = game.copyGameInput(multies);
  game.alternatingColors = checkForAlternatingMode();  
  game.maxMoves = +d3.select("#movecount").property("value");
  
  //console.log(JSON.stringify(game));
  
  // solve and post
  game.solvegame();
  d3.select("#solution").text("Solution: " + JSON.stringify(game.solution));
  plotSolution(game.solution);
}

