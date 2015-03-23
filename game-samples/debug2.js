// puzzle 85 debug

var singleTiles = [[5,4],[7,6],[7,3],[8,4],[9,2]]
var tiles = [[4,7],[4,6],[5,7]]
var to = [5,6]
var emptyTiles = [[9,3],[9,4],[7,4],[7,2],[8,2],[6,3],[8,5],[5,5],[6,6],[5,6]]
dwelp.isLegalMove(tiles, to, emptyTiles, singleTiles, null)

//new singles: {"blue":[],"orange":[[6,4],[7,5],[6,7],[5,6],[4,5]],"purple":[[5,4],[7,6],[7,3],[8,4],[9,2]],"red":[],"green":[]}
//dwelp.js:193 new groups: {"purple":[[4,7],[4,6],[5,7]]}
//dwelp.js:194 new empties: [[9,3],[9,4],[7,4],[7,2],[8,2],[6,3],[8,5],[5,5],[6,6],[6,5]]
//dwelp.js:277 move 0: considering [6,5]->[4,7]
//new singles: {"blue":[],"orange":[[6,7],[4,5]],"purple":[[5,4],[7,6],[7,3],[8,4],[9,2]],"red":[],"green":[]}
//dwelp.js:193 new groups: {"purple":[[4,7],[4,6],[5,7]],"orange":[[6,5],[6,4],[7,5]]}
//dwelp.js:194 new empties: [[9,3],[9,4],[7,4],[7,2],[8,2],[6,3],[8,5],[5,5],[6,6],[5,6]]
//dwelp.js:277 move 1: considering [5,6]->[6,5]
