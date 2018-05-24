//http://tianyuan11111.com/8-Puzzle/

// Up = 0, Down = 1, Left = 2, Right = 3

// Final Result
// 1 2 3
// 4 5 6
// 7 8 0

//g(n) = level, h(n) = manhattanDistance(n);

window.onload = function() {
  init();
};

function memorySizeOf(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if(obj !== null && obj !== undefined) {
            switch(typeof obj) {
            case 'number':
                bytes += 8;
                break;
            case 'string':
                bytes += obj.length * 2;
                break;
            case 'boolean':
                bytes += 4;
                break;
            case 'object':
                var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                if(objClass === 'Object' || objClass === 'Array') {
                    for(var key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;
                        sizeOf(obj[key]);
                    }
                } else bytes += obj.toString().length * 2;
                break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        if(bytes < 1024) return bytes + " bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
        else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
        else return(bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
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

var manhattanDistance = function(map) {
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

var IDA_star_loop = function(node, bound, tree) {
    tree.push(node);
    let cost = node.level + node.distToTarget;
    if(cost > bound) return cost;
    if(checkResult(node.map) == true) return 'FOUND';

    let minCost = Infinity;
    let map = node.map;
    let p_index = node.index;
    let p_level = node.level;
    let zeroPosition = map.findIndex(map => map === 0);
    let possNextMove = nextMoveFunc(zeroPosition);

    for (let i in possNextMove) {
        let newMap = nextMapFunc(possNextMove[i], map.slice(), zeroPosition);
        let tf = checkMapExist(tree, newMap);
        if (tf == false) {
            /* pack the new node */
            let newNode = {
               index: tree.length,
               parentIndex: p_index,
               map: newMap,
               level: p_level + 1,
               distToTarget: manhattanDistance(newMap)
            };
            //console.log("newNode: ", newNode);
            let t = IDA_star_loop(newNode, bound, tree);
            if(t === 'FOUND') return 'FOUND';
            if(t < minCost) minCost = t;
        }
    }
    return minCost;
}

var IDA_star = function(initMap) {
    let initNode = {
      index: 0,
      parentIndex: -1,
      map: initMap,
      level: 0,
      distToTarget: manhattanDistance(initMap)
    };
    let bound = initNode.distToTarget;
    let tree = [];
    let i = 1;
    while(1) {
        console.log("Loop: ", i);
        console.log("Bound: ", bound);
        tree = [];
        let t = IDA_star_loop(initNode, bound, tree);
        if(t === 'FOUND') break;
        else bound = t;
        i = i + 1;
    }
    return tree;
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

  let result = [];

  // Create test case
  // let mapArray = [2,3,1,4,5,6,7,8,0]; //21 step
  //let mapArray = [2,0,3,1,4,6,7,5,8]; // 5 step
  // let mapArray = [1,2,3,4,0,6,7,5,8]; // 3 steps
  // let mapArray = [1, 2, 3, 4, 5, 6, 7, 0, 8];
  let mapArray = [8, 6, 7, 2, 5, 4, 3, 0 ,1]; //31 steps
  //let mapArray = [3, 0 ,2, 6, 5, 1, 4, 7 ,8];

  let t1 = Date.now();
  let tree = IDA_star(mapArray);
  let t2 = Date.now();
  let time = (t2 - t1) / 1000;
  console.log("Running Time: ", time);

  let size = memorySizeOf(tree);
  console.log("Tree Size: ", size);

  console.log("tree", tree);
  savePath(tree, result, tree.length-1);
  console.log("Result!!", result);

}
