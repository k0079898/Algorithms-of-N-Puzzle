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

// Calculate the allowedNextMove;
function nextMoveFunc(zeroPosition) {
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
function nextMapFunc(allowedNextMove, aMap, zeroPosition) {
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

function checkMapExistV2(tree, map, index) {
  let tf = false;
  let path  = [];
  savePath(tree, path, index);
  for (let i in path) {
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

function checkMapExist(tree, map) {
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

function checkResult(newMap) {
  let isResult = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  let count = 0;
  for(let i = 0 ; i < newMap.length ; i++) {
      if(isResult[i] == newMap[i]) count++;
  }
  if(count == newMap.length) return true;
  return false;
}

function hammingDistance(map) {
  let d = 0;
  for(let i = 0 ; i < map.length ; i++) {
    if(i!=8 && map[i] != i+1 && map[i]!=0) d++;
    else if(i==8 && map[i]!=0) d++;
  }
  return d;
}

function manhattanDistance(map) {
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

function savePath(tree, result, treeIndex) {
    let node = tree[treeIndex];
    while(node.parentIndex != -1) {
      result.unshift(node.map);
      node = tree[node.parentIndex];
    }
    result.unshift(node.map);
}

function bfs(tree, queue, treeIndex) {
  let node = queue.shift();
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
    }
    /* check if last node is result, if yes than return */
    if(checkResult(newMap) == true) break;
  }
}

function bfs_start(mapArray) {
  console.log("Starting BFS Algorithm");
  let tree = [];
  let queue = [];
  let treeIndex = 0;
  let result = [];

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
  }
  let t2 = Date.now();
  let time = (t2 - t1) / 1000;
  console.log("Running Time: ", time);

  let size = memorySizeOf(tree);
  console.log("BFS Generated Node: ", tree.length);
  console.log("Memory Used: ", size);

  savePath(tree, result, treeIndex);
  console.log("Step: ", result.length-1);
  return result;
};

function hillclimbing_hamming(tree, stack, treeIndex) {
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
         dislocation: hammingDistance(newMap)
      };
      /* push new map in tree and queue */
      tree.push(newNode);
      Tstack.push(newNode);
      if(checkResult(newMap) == true) return;
    }
  }
  Tstack = Tstack.sort(function (a, b) {
    return a.dislocation > b.dislocation ? 1 : -1;
  });
  let length = Tstack.length;
  for(let j = 0 ; j < length ; j++) {
    let Tnode = Tstack.pop();
    stack.push(Tnode);
  }
}

function hillclimb_hamming_start(mapArray) {
  console.log("Starting Hill Climbing(Hamming Distance) Algorithm");
  let tree = [];
  let treeIndex = 0;
  let stack = [];
  let result = [];

  let initNode = {
    index: treeIndex,
    parentIndex: -1,
    map: mapArray,
    dislocation: hammingDistance(mapArray)
  };
  tree.push(initNode);
  stack.push(initNode);

  let t1 = Date.now();
  while(!checkResult(tree[treeIndex].map)) {
    hillClimbing(tree, stack, treeIndex);
    treeIndex = tree.length - 1;
  }
  let t2 = Date.now();
  let time = (t2 - t1) / 1000;
  console.log("Running Time: ", time);

  let size = memorySizeOf(tree);
  console.log("Hill Climbing(Hamming Distance) Generated Node: ", tree.length);
  console.log("Memory Used: ", size);

  //return result;
  savePath(tree, result, treeIndex);
  console.log("Step: ", result.length-1);
  return result;
}

function hillclimbing_manhattan(tree, stack, treeIndex) {
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
         distance: manhattanDistance(newMap)
      };
      /* push new map in tree and queue */
      tree.push(newNode);
      Tstack.push(newNode);
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

function hillclimb_manhattan_start(mapArray) {
  console.log("Starting Hill Climbing(Manhattan Distance) Algorithm");
  let tree = [];
  let treeIndex = 0;
  let stack = [];
  let result = [];

  let initNode = {
    index: treeIndex,
    parentIndex: -1,
    map: mapArray,
    distance: manhattanDistance(mapArray)
  };
  tree.push(initNode);
  stack.push(initNode);

  let t1 = Date.now();
  while(!checkResult(tree[treeIndex].map)) {
    hillclimbing_manhattan(tree, stack, treeIndex);
    treeIndex = tree.length - 1;
  }
  let t2 = Date.now();
  let time = (t2 - t1) / 1000;
  console.log("Running Time: ", time);

  let size = memorySizeOf(tree);
  console.log("Hill Climbing(Manhattan Distance) Generated Node: ", tree.length);
  console.log("Memory Used: ", size);

  //return result;
  savePath(tree, result, treeIndex);
  console.log("Step: ", result.length-1);
  return result;
}

var a_star = function(tree, list, treeIndex) {
    // Find the smallest f(n) + g(n)
    // f(n) = tree.level
    // g(n) = distToTarget
    let lowestIndex = list[0];
    let lowestCost = tree[lowestIndex].level + tree[lowestIndex].distToTarget;

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
    let node = tree[lowestIndex];
    list.splice(target, 1);

    let map = node.map;
    let p_index = node.index;
    let p_level = node.level;
    let zeroPosition = map.findIndex(map => map === 0);
    let possNextMove = nextMoveFunc(zeroPosition);

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
          distToTarget: manhattanDistance(nextMap),
        }
        list.push(tree.length);
        tree.push(newNode);
      }
      if(checkResult(nextMap) == true) break;
    }
}

function astar_start(mapArray) {
  console.log("Starting A* Algorithm");
  let tree = [];
  let list = [];
  let treeIndex = 0;
  let result = [];

  let initNode = {
    index: treeIndex,
    parentIndex: -1,
    map: mapArray,
    level: 0,
    distToTarget: manhattanDistance(mapArray),
  };
  tree.push(initNode);
  list.push(0);

  let t1 = Date.now();
  while(!checkResult(tree[treeIndex].map)) {
    a_star(tree, list, treeIndex);
    treeIndex = tree.length - 1;
  }
  let t2 = Date.now();
  let time = (t2 - t1) / 1000;
  console.log("Running Time: ", time);

  let size = memorySizeOf(tree);
  console.log("A* Generated Node: ", tree.length);
  console.log("Memory Used: ", size);

  savePath(tree, result, treeIndex);
  console.log("Step: ", result.length-1);
  return result;
}

var IDA_star_loop = function(node, bound, tree, nodeExplo) {
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

        let tf = checkMapExistV2(tree, newMap, p_index);
        if (tf == false) {
            /* pack the new node */
            let newNode = {
               index: tree.length,
               parentIndex: p_index,
               map: newMap,
               level: p_level + 1,
               distToTarget: manhattanDistance(newMap)
            };
            if(checkMapExist(nodeExplo, newMap) == false) nodeExplo.push(newNode);
            let t = IDA_star_loop(newNode, bound, tree, nodeExplo);
            if(t === 'FOUND') return 'FOUND';
            if(t < minCost) minCost = t;
        }
    }
    return minCost;
}

function IDA_star(initMap) {
    let initNode = {
      index: 0,
      parentIndex: -1,
      map: initMap,
      level: 0,
      distToTarget: manhattanDistance(initMap)
    };
    let bound = initNode.distToTarget;
    let tree = [];
    let nodeExplo = [];
    let i = 0;
    while(1) {
        i = i + 1;

        tree = [];
        nodeExplo = [];
        nodeExplo.push(initNode);
        let t = IDA_star_loop(initNode, bound, tree, nodeExplo);
        let size = memorySizeOf(nodeExplo);
        console.log("IDA* Loop: ", i);
        console.log("Bound: ", bound);
        console.log("Generated Node: ", nodeExplo.length);
        console.log("Memory Used: ", size);
        if(t === 'FOUND') break;
        else bound = t;
    }
    return tree;
}

function idastar_start(mapArray) {
  console.log("Starting IDA* Algorithm");
  let result = [];

  let t1 = Date.now();
  let tree = IDA_star(mapArray);
  let t2 = Date.now();
  let time = (t2 - t1) / 1000;
  console.log("Running Time: ", time);

  //console.log(tree);
  savePath(tree, result, tree.length-1);
  console.log("Step: ", result.length-1);
  return result;
}
