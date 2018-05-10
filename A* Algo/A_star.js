//http://tianyuan11111.com/8-Puzzle/

// Up = 0, Down = 1, Left = 2, Right = 3

// Final Result
// 1 2 3
// 4 5 6
// 7 8 0

//g(n) = level, h(n) = manhattanFunc(n);

window.onload = function() {
  init();
};

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

var manhattanFunc = function(map) {
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

// var hammingFunc = function (mapArray) {
//   let d = 0;
//   let deArray = [1, 2, 3, 4, 5, 6, 7, 8, 0];
//   for (i = 0; i < mapArray.length; i++) {
//     if ((mapArray[i] != deArray[i]) && (mapArray[i] != 0)) d++;
//   }
//   return d;
// }

var a_star = function(tree, list, treeIndex) {
    // Find the smallest f(n) + g(n)
    // f(n) = tree.level
    // g(n) = distToTarget
    let lowestIndex = list[0];
    let lowestCost = tree[lowestIndex].level + tree[lowestIndex].distToTarget;
    //console.log("B: ", lowestIndex, lowestCost);

    // Choose the lowestCost node
    let target = 0;
    for (let k in list) {
      let listIndex = list[k];
      //console.log(lowestCost, tree[listIndex].level + tree[listIndex].distToTarget);
      if (lowestCost > (tree[listIndex].level + tree[listIndex].distToTarget)) {
        lowestCost = tree[listIndex].level + tree[listIndex].distToTarget;
        lowestIndex = listIndex;
        target = k;
      }
    }
    //console.log("A: ", lowestIndex, lowestCost);

    let node = tree[lowestIndex];
    list.splice(target, 1);


    let map = node.map;
    let p_index = node.index;
    let p_level = node.level;
    let zeroPosition = map.findIndex(map => map === 0);
    let possNextMove = nextMoveFunc(zeroPosition);

    // Get the nextMove
    // console.log("tree.length: ", tree.length);
    for (let j in possNextMove) {
      let nextMap = nextMapFunc(possNextMove[j], map.slice(), zeroPosition);
      let tf = checkMapExist(tree, nextMap);
      // console.log(tf);
      if (tf == false) {
        let newNode = {
          index: tree.length,
          parentIndex: p_index,
          map: nextMap,
          level: p_level+1,
          distToTarget: manhattanFunc(nextMap),
        }
        // console.log("newNode", newNode);
        // console.log("index:", newNode.index, "price:", newNode.level+newNode.distToTarget,"newNode.map:", newNode.map);
        list.push(tree.length);
        tree.push(newNode);
        // console.log("list:", list);
      }
    };
}

var savePath = function (tree, result, treeIndex) {
    let node = tree[treeIndex];
    while(node.parentIndex != -1) {
      result.unshift(node.map);
      node = tree[node.parentIndex];
    }
    result.unshift(node.map);
}

var init = function() {
  let tree = [];
  let list = [];
  let treeIndex = 0;
  let result = [];

  // Create test case
  // let mapArray = [2,3,1,4,5,6,7,8,0]; //21 step
  // let mapArray = [2,0,3,1,4,6,7,5,8]; // 5 step
  // let mapArray = [1,2,3,4,0,6,7,5,8]; // 3 steps
  // let mapArray = [1, 2, 3, 4, 5, 6, 7, 0, 8];
  let mapArray = [8, 6, 7, 2, 5, 4, 3, 0 ,1]; //31 steps
  let initNode = {
    index: treeIndex,
    parentIndex: -1,
    map: mapArray,
    level: 0,
    distToTarget: manhattanFunc(mapArray),
  };
  tree.push(initNode);
  list.push(0);
  console.log(mapArray);
  // while(!checkResult(tree[treeIndex].map)) {
  //   a_star(tree, list, treeIndex);
  //   treeIndex = tree.length - 1;
  // }

  let t1 = Date.now();
  while(!checkResult(tree[treeIndex].map)) {
    a_star(tree, list, treeIndex);
    treeIndex = tree.length - 1;
  }
  let t2 = Date.now();
  let time = (t2 - t1) / 1000;
  console.log("Running Time: ", time);

  console.log("tree", tree);
  console.log(treeIndex);
  savePath(tree, result, treeIndex);
  console.log("Result!!", result);

}
