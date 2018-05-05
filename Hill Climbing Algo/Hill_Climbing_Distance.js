// Up = 0, Down = 1, Left = 2, Right = 3

// Final Result
// 1 2 3
// 4 5 6
// 7 8 0

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
      //console.log("Up");
      var temp = tempMap[zeroPosition];
      tempMap[zeroPosition] = tempMap[zeroPosition-3];
      tempMap[zeroPosition-3] = temp;
      break;
    case 1: // Down
      //console.log("Down");
      var temp = tempMap[zeroPosition];
      tempMap[zeroPosition] = tempMap[zeroPosition+3];
      tempMap[zeroPosition+3] = temp;
      break;
    case 2: // Left
      //console.log("Left");
      var temp = tempMap[zeroPosition];
      tempMap[zeroPosition] = tempMap[zeroPosition-1];
      tempMap[zeroPosition-1] = temp;
      break;
    case 3: // Right
      //console.log("Right");
      var temp = tempMap[zeroPosition];
      tempMap[zeroPosition] = tempMap[zeroPosition+1];
      tempMap[zeroPosition+1] = temp;
      break;
    default:
      break;
  }
  return tempMap;
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

var checkResult = function (map) {
  let isResult = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  let count = 0;
  for(let i = 0 ; i < map.length ; i++) {
      if(isResult[i] == map[i]) count++;
  }
  if(count == map.length) return true;
  return false;
}

var rectilinearDistance = function(map) {
  let d = 0;
  for(let i = 0 ; i < 3 ; i++) {
    for(let j = 0; j < 3 ; j++) {
      switch (map[(i*3)+j]) {
        case 1:
          d = d + Math.abs(i-0) + Math.abs(j-0);
          break;
        case 2:
          d = d + Math.abs(i-0) + Math.abs(j-1);
          break;
        case 3:
          d = d + Math.abs(i-0) + Math.abs(j-2);
          break;
        case 4:
          d = d + Math.abs(i-1) + Math.abs(j-0);
          break;
        case 5:
          d = d + Math.abs(i-1) + Math.abs(j-1);
          break;
        case 6:
          d = d + Math.abs(i-1) + Math.abs(j-2);
          break;
        case 7:
          d = d + Math.abs(i-2) + Math.abs(j-0);
          break;
        case 8:
          d = d + Math.abs(i-2) + Math.abs(j-1);
          break;
        default:
          break;
      }
    }
  }
  return d;
}

var hillClimbing = function(tree, stack, treeIndex) {
  let node = stack.pop();
  let map = node.map;
  let p_index = node.index;
  let Tstack = [];
  let zeroPosition = map.findIndex(map => map === 0);
  let possNextMove = nextMoveFunc(zeroPosition);

  for (let i in possNextMove) {
    let newMap = nextMapFunc(possNextMove[i], map.slice(), zeroPosition);
    let tf = checkMapExist(tree, newMap);
    if (tf == false) {
      /* pack the new node */
      treeIndex = treeIndex + 1;
      let newNode = {
         index: treeIndex,
         parentIndex: p_index,
         map: newMap,
         distance: rectilinearDistance(newMap)
      };
      /* push new map in tree and queue */
      tree.push(newNode);
      Tstack.push(newNode);
      console.log("newNode: ", newNode)
      if(checkResult(newMap) == true) return;
    }
  }
  Tstack = Tstack.sort(function (a, b) {
    return a.distance > b.distance ? 1 : -1;
  });
  let length = Tstack.length;
  for(let j = 0 ; j < length ; j++) {
    let Tnode = Tstack.pop();
    stack.push(Tnode);
  }
}

var savePath = function (tree, result, treeIndex) {
    let node = tree[treeIndex];
    while(node.parentIndex != -1) {
      result.unshift(node.map);
      node = tree[node.parentIndex];
    }
    result.unshift(node.map);
}

function init() {
  let tree = [];
  let treeIndex = 0;
  let stack = [];
  let result = [];

  let mapArray = [1, 2, 3, 4, 6, 0, 7, 5, 8];
  let initNode = {
    index: treeIndex,
    parentIndex: -1,
    map: mapArray,
    distance: rectilinearDistance(mapArray)
  };
  tree.push(initNode);
  stack.push(initNode);


  while(!checkResult(tree[treeIndex].map)) {
    hillClimbing(tree, stack, treeIndex);
    treeIndex = tree.length - 1;
  }

  //return result;
  savePath(tree, result, treeIndex);
  console.log("Tree: ", tree);
  console.log("Result!!", result);

}
