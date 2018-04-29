// Up = 0, Down = 1, Left = 2, Right = 3

// Final Result
// 1 2 3
// 4 5 6
// 7 8 0

var stateQueue = [];
var defaultMapArray = [1, 2, 3, 4, 5, 6, 7, 0, 8];
var mapArray;

window.onload = function() {
  init();
};

// Calculate the allowedNextMove;
var nextMoveFunc = function(zeroPosition) {
  var notAllowMovePos = [[0, 1, 2],[6, 7, 8],[0, 3, 6], [2, 5, 8]]; //Up Down Left Right
  var tempMove = [];

  // Consider the position of '0'
  for (let i = 0; i <= 3; i++) {
    if (notAllowMovePos[i].includes(zeroPosition) == false)
      tempMove.push(i);
  }
  return tempMove;
}

// Create nextMap
var nextMapFunc = function(allowedNextMove, aMap, zeroPosition) {
  tempMap = aMap;
  switch (allowedNextMove) {
    case 0: // Up
      console.log("Up");
      var temp = tempMap[zeroPosition];
      tempMap[zeroPosition] = tempMap[zeroPosition-3];
      tempMap[zeroPosition-3] = temp;
      break;
    case 1: // Down
      console.log("Down");
      var temp = tempMap[zeroPosition];
      tempMap[zeroPosition] = tempMap[zeroPosition+3];
      tempMap[zeroPosition+3] = temp;
      break;
    case 2: // Left
      console.log("Left");
      var temp = tempMap[zeroPosition];
      tempMap[zeroPosition] = tempMap[zeroPosition-1];
      tempMap[zeroPosition-1] = temp;
      break;
    case 3: // Right
      console.log("Right");
      var temp = tempMap[zeroPosition];
      tempMap[zeroPosition] = tempMap[zeroPosition+1];
      tempMap[zeroPosition+1] = temp;
      break;
    default:
      break;
  }
  return tempMap;
}

var rightShiftFunc = function (defaultMapArray, i) { // Right Shift
  var L = defaultMapArray.length;
  return defaultMapArray.slice(L - i).concat(defaultMapArray.slice(0, L - i));
}

var checkMapExist = function (tree, map) {
  let tf = false;
  for (let i in tree) {
    let num = 0;
    for(let j = 0 ; j < map.length ; j++) {
        if(tree[i].map[j] == map[j]) {
            num = num + 1;
        }
    }
    if(num == map.length) {
        tf = true;
        break;
    }
  }
  return tf;
}

function init() {
  let tree = [];
  let treeIndex = 0;
  // Create test case
  for (let i = 0; i < 9; i++) {

    mapArray = rightShiftFunc(defaultMapArray, i);
    let node = {
      index: treeIndex,
      parentIndex: 0,
      map: mapArray
    };
    tree.push(node);

    // Calculate the allowedNextMove
    var zeroPosition = node.map.findIndex(map => map === 0);
    // console.log("zeroPosition: ", zeroPosition);

    var nextMove = nextMoveFunc(zeroPosition);

    for (let j in nextMove) {
      let newMap = nextMapFunc(nextMove[j], mapArray.slice(), zeroPosition);

      // Save to tree and queue
      let tf = checkMapExist(tree, newMap);
      if (tf == true) {

      }
    }



    // var allowedNextMove =  allowedNextMoveFunc(node.parentsAction, zeroPosition);
    //
    // // Create nextMap
    // for (i in newState.allowedNextMove){
    //   tempMap = newState.map.slice();
    //   var newMap = nextMapFunc(newState.allowedNextMove[i], tempMap, newState.zeroPosition)
    // }
    //
    // stateQueue.push(newState);
  };
};
