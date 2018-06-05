/// <reference path="../lib/typings/jquery/jquery.d.ts"/>

//window.onload = () => {
//let tiles = [2, 3, 1, 4, 5, 6, 7, 8, 0];
let tiles = [2, 0, 3, 1, 4, 6, 7, 5, 8];
//let tiles = [5, 1, 2, 6, 3, 0, 4, 7, 8];
$(document).ready(function() {
  let tiles_internal = tiles.slice(0,9);
  var $target = undefined;

  var checkSolvable = function(map) {
    let count = 0;
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 9; j++) {
        if (map[i] > map[j] && map[i] != 0 && map[j] != 0) count = count + 1;
      }
    }
    for (let i = 0; i <= 8; i++){
      sum = sum + map[i];
    }
    //console.log(count);
    if (count % 2 == 0 && sum == 36) return true;
    else return false;
  };

  if(checkSolvable(tiles)){
    document.getElementById('solveability').innerHTML = "(Solvable)";
    //console.log("text to solvable");
    $('#bfsalgo').prop('disabled',false);
    $('#hillclimb').prop('disabled',false);
    $('#astar').prop('disabled',false);
    $('#idastar').prop('disabled',false);
  }else{
    document.getElementById('solveability').innerHTML = "(Unsolvable)";
    console.log("unsolvable");
    $('#bfsalgo').prop('disabled',true);
    $('#hillclimb').prop('disabled',true);
    $('#astar').prop('disabled',true);
    $('#idastar').prop('disabled',true);
  }

  var renderTiles = function($newTarget) {
    $target = $newTarget || $target;

    var $ul = $("<ul>", {
      "class": "n-puzzle"
    });

    $(tiles_internal).each(function(index) {
      var correct = index + 1 == this;
      var cssClass = this == 0 ? "empty" : (correct ? "correct" : "incorrect");

      var $li = $("<li>", {
        "class": cssClass,
        "data-tile": this,
      });
      $li.text(this);
      $li.click({
        index: index
      }, shiftTile);
      $ul.append($li);
    });

    $target.html($ul);
  };

  var shiftTile = function(event) {
    var index = event.data.index;

    var targetIndex = -1;
    if (index - 1 >= 0 && tiles_internal[index - 1] == 0) { // check left
      targetIndex = index - 1;
    } else if (index + 1 < tiles_internal.length && tiles_internal[index + 1] == 0) { // check right
      targetIndex = index + 1;
    } else if (index - 3 >= 0 && tiles_internal[index - 3] == 0) { //check up
      targetIndex = index - 3;
    } else if (index + 3 < tiles_internal.length && tiles_internal[index + 3] == 0) { // check down
      targetIndex = index + 3;
    }

    if (targetIndex != -1) {
      var temp = tiles_internal[targetIndex];
      tiles_internal[targetIndex] = tiles_internal[index];
      tiles_internal[index] = temp;
      renderTiles();
      //console.log("index: ", index);
      //console.log("targetIndex: ", targetIndex);
    }

    event.preventDefault();
  };

  renderTiles($('.eight-puzzle'));

  $('#bfsalgo').on('click', function(e) {
    //tiles = [2, 3, 1, 4, 5, 6, 7, 8, 0];
    //tiles = [2, 0, 3, 1, 4, 6, 7, 5, 8];
    //tiles = [5, 1, 2, 6, 3, 0, 4, 7, 8];
    $('#bfsalgo').prop('disabled',true);
    $('#hillclimb').prop('disabled',true);
    $('#astar').prop('disabled',true);
    $('#idastar').prop('disabled',true);
    document.getElementById('solveability').innerHTML = "(Loading)";
    tiles_internal = tiles.slice(0,9);
    console.log("BFS button click!");
    startbfs(tiles_internal);
  });

  $('#hillclimb').on('click', function(e) {
    //tiles = [2, 3, 1, 4, 5, 6, 7, 8, 0];
    //tiles = [2, 0, 3, 1, 4, 6, 7, 5, 8];
    //tiles = [5, 1, 2, 6, 3, 0, 4, 7, 8];
    $('#bfsalgo').prop('disabled',true);
    $('#hillclimb').prop('disabled',true);
    $('#astar').prop('disabled',true);
    $('#idastar').prop('disabled',true);
    document.getElementById('solveability').innerHTML = "(Loading)";
    tiles_internal = tiles.slice(0,9);
    console.log("Hill-climbing button click!");
    starthillclimb(tiles_internal);
  });

  $('#astar').on('click', function(e) {
    //tiles = [2, 3, 1, 4, 5, 6, 7, 8, 0];
    //tiles = [2, 0, 3, 1, 4, 6, 7, 5, 8];
    //tiles = [5, 1, 2, 6, 3, 0, 4, 7, 8];
    $('#bfsalgo').prop('disabled',true);
    $('#hillclimb').prop('disabled',true);
    $('#astar').prop('disabled',true);
    $('#idastar').prop('disabled',true);
    document.getElementById('solveability').innerHTML = "(Loading)";
    tiles_internal = tiles.slice(0,9);
    console.log("A* button click!");
    startastar(tiles_internal);
  });

  $('#idastar').on('click', function(e) {
    //tiles = [2, 3, 1, 4, 5, 6, 7, 8, 0];
    //tiles = [2, 0, 3, 1, 4, 6, 7, 5, 8];
    //tiles = [5, 1, 2, 6, 3, 0, 4, 7, 8];
    $('#bfsalgo').prop('disabled',true);
    $('#hillclimb').prop('disabled',true);
    $('#astar').prop('disabled',true);
    $('#idastar').prop('disabled',true);
    document.getElementById('solveability').innerHTML = "(Loading)";
    tiles_internal = tiles.slice(0,9);
    console.log("IDA* button click!");
    startidastar(tiles_internal);
  });

  $('#board-change').on('click', function(e) {
    console.log("change button click!");
    tiles[0] = +document.getElementById("board1").value;
    tiles[1] = +document.getElementById("board2").value;
    tiles[2] = +document.getElementById("board3").value;
    tiles[3] = +document.getElementById("board4").value;
    tiles[4] = +document.getElementById("board5").value;
    tiles[5] = +document.getElementById("board6").value;
    tiles[6] = +document.getElementById("board7").value;
    tiles[7] = +document.getElementById("board8").value;
    tiles[8] = +document.getElementById("board0").value;
    //console.log("tiles:",tiles);
    tiles_internal = tiles.slice(0,9);
    //console.log("tiles_internal:",tiles_internal);
    if(checkSolvable(tiles)){
      document.getElementById('solveability').innerHTML = "(Solvable)";
      //console.log("text to solvable");
      renderTiles($('.eight-puzzle'));
      $('#bfsalgo').prop('disabled',false);
      $('#hillclimb').prop('disabled',false);
      $('#astar').prop('disabled',false);
      $('#idastar').prop('disabled',false);
    }else{
      document.getElementById('solveability').innerHTML = "(Unsolvable)";
      //console.log("text to unsolvable");
      renderTiles($('.eight-puzzle'));
      $('#bfsalgo').prop('disabled',true);
      $('#hillclimb').prop('disabled',true);
      $('#astar').prop('disabled',true);
      $('#idastar').prop('disabled',true);
    }
  });

  $('#cleardata').on('click', function(e) {
    console.log("clear click");
    for(let i = adata1.length; i > 0; i--)
      adata1.pop();
    for(let i = adata2.length; i > 0; i--)
      adata2.pop();
    myLineChart.update();
  });

  function startbfs(tile) {
    var npuzzle = document.querySelectorAll('[data-tile]');
    //console.log("starting bfs");
    let bfs_result = bfs_start(tile);
    var i;
    for (i = 1; i < bfs_result.length; i++) {
      let zeroindex = bfs_result[i].findIndex(function(element) {
        return element == 0;
      });
      /*console.log(bfs_result[i].findIndex(function(element) {
        return element == 0;
      }));*/
      setTimeout(function() {
        var npuzzle = document.querySelectorAll('[data-tile]');
        npuzzle[zeroindex].click();
        //console.log("puzzle location " + zeroindex + " clicked");
      }, 500 * i);
    }
    setTimeout(function() {
      $('#bfsalgo').prop('disabled',false);
      $('#hillclimb').prop('disabled',false);
      $('#astar').prop('disabled',false);
      $('#idastar').prop('disabled',false);
      document.getElementById('solveability').innerHTML = "(Solved)";
    }, 500 * i);
  }

  function starthillclimb(tile) {
    var npuzzle = document.querySelectorAll('[data-tile]');
    //console.log("starting hill climbing");
    let hill_result = hillclimb_manhattan_start(tile);
    //let hill_result = hillclimb_hamming_start(tile);
    var i;
    for (i = 1; i < hill_result.length; i++) {
      let zeroindex = hill_result[i].findIndex(function(element) {
        return element == 0;
      });
      /*console.log(hill_result[i].findIndex(function(element) {
        return element == 0;
      }));*/
      setTimeout(function() {
        var npuzzle = document.querySelectorAll('[data-tile]');
        npuzzle[zeroindex].click();
        //console.log("puzzle location " + zeroindex + " clicked");
      }, 500 * i);
    }
    setTimeout(function() {
      $('#bfsalgo').prop('disabled',false);
      $('#hillclimb').prop('disabled',false);
      $('#astar').prop('disabled',false);
      $('#idastar').prop('disabled',false);
      document.getElementById('solveability').innerHTML = "(Solved)";
    }, 500 * i);
  }

  function startastar(tile) {
    for(let i = adata1.length; i > 0; i--)
      adata1.pop();
    myLineChart.update();
    var npuzzle = document.querySelectorAll('[data-tile]');
    let star_result = astar_start(tile);
    var i;
    var count = 0;
    for (i = 1; i < star_result.length; i++) {
      let zeroindex = star_result[i].findIndex(function(element) {
        return element == 0;
      });
      /*console.log(star_result[i].findIndex(function(element) {
        return element == 0;
      }));*/
      setTimeout(function() {
        count +=  1;
        var npuzzle = document.querySelectorAll('[data-tile]');
        npuzzle[zeroindex].click();
        //console.log("puzzle location " + zeroindex + " clicked");
        //console.log("count=",count);
        //console.log("manhattanDistance=",manhattanDistance(tiles_internal));
        adata1.push(manhattanDistance(tiles_internal));
        myLineChart.update();
      }, 500 * i);
    }
    setTimeout(function() {
      $('#bfsalgo').prop('disabled',false);
      $('#hillclimb').prop('disabled',false);
      $('#astar').prop('disabled',false);
      $('#idastar').prop('disabled',false);
      document.getElementById('solveability').innerHTML = "(Solved)";
    }, 500 * i);
  }

  function startidastar(tile) {
    for(let i = adata2.length; i > 0; i--)
      adata2.pop();
    myLineChart.update();
    var npuzzle = document.querySelectorAll('[data-tile]');
    let star_result = idastar_start(tile);
    var i;
    var count = 0;
    for (i = 1; i < star_result.length; i++) {
      let zeroindex = star_result[i].findIndex(function(element) {
        return element == 0;
      });
      /*console.log(star_result[i].findIndex(function(element) {
        return element == 0;
      }));*/
      setTimeout(function() {
        count +=  1;
        var npuzzle = document.querySelectorAll('[data-tile]');
        npuzzle[zeroindex].click();
        //console.log("puzzle location " + zeroindex + " clicked");
        //console.log("count=",count);
        //console.log("manhattanDistance=",manhattanDistance(tiles_internal));
        adata2.push(manhattanDistance(tiles_internal));
        myLineChart.update();
      }, 500 * i);
    }
    setTimeout(function() {
      $('#bfsalgo').prop('disabled',false);
      $('#hillclimb').prop('disabled',false);
      $('#astar').prop('disabled',false);
      $('#idastar').prop('disabled',false);
      document.getElementById('solveability').innerHTML = "(Solved)";
    }, 500 * i);
  }
});
