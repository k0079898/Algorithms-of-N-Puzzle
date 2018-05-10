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

var checkResult = function (newMap) {
  let isResult = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  let count = 0;
  for(let i = 0 ; i < newMap.length ; i++) {
      if(isResult[i] == newMap[i]) count++;
  }
  if(count == newMap.length) return true;
  return false;
}

//BFS function
var bfs = function (tree, queue, treeIndex) {
  let node = queue.shift();
  //console.log("node",node);
  let map = node.map;
  let p_index = node.index;
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
         map: newMap
      };
      /* push new map in tree and queue */
      tree.push(newNode);
      queue.push(newNode);
      //console.log("newNode: ", newNode)
    }
    /* check if last node is result, if yes than return */
    if(checkResult(newMap) == true) break;
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
  let queue = [];
  let treeIndex = 0;
  let result = [];

  /* Generate a initial mapArray */
  //let mapArray = [8, 6, 7, 2, 5, 4, 3, 0 ,1]; /* 31 Step Testcase */
  let mapArray = [3, 6, 8, 5, 1, 7, 2, 4, 0];

  let initNode = {
    index: treeIndex,
    parentIndex: -1,
    map: mapArray
  };
  tree.push(initNode);
  queue.push(initNode);

  let t1 = Date.now();
  while(!checkResult(tree[treeIndex].map)) {
    bfs(tree, queue, treeIndex);
    treeIndex = tree.length - 1;
    //console.log(tree);
    //console.log("treeIndex", treeIndex);
  }
  let t2 = Date.now();
  let time = (t2 - t1) / 1000;
  console.log("Running Time: ", time);

  savePath(tree, result, treeIndex);
  console.log("Tree: ", tree);
  console.log("Result!!", result);
  // return result;
};
