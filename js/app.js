/// <reference path="../lib/typings/jquery/jquery.d.ts"/>

//window.onload = () => {
$(document).ready(function () {
    //let tiles = [2, 3, 1, 4, 5, 6, 7, 8, 0];
    //let tiles = [8, 6, 7, 2, 5, 4, 3, 0 ,1]; //31
    let tiles = [8, 7, 4, 3, 2, 0, 6, 5, 1]; //25
    //let tiles = [7, 3, 0, 5, 4, 8, 1, 2, 6]; //24
    //let tiles = [2, 3, 1, 4, 5, 6, 7, 8, 0]; //16
    //let tiles = [5, 1, 2, 6, 3, 0, 4, 7, 8]; //11
    //let tiles = [2, 0 ,3, 1, 4, 6, 7, 5, 8]; //5

    var $target = undefined;

    var renderTiles = function ($newTarget) {
        $target = $newTarget || $target;

        var $ul = $("<ul>", {
            "class": "n-puzzle"
        });

        $(tiles).each(function (index) {
            var correct = index + 1 == this;
            var cssClass = this == 0 ? "empty" : (correct ? "correct" : "incorrect");

            var $li = $("<li>", {
                "class": cssClass,
                "data-tile": this,
            });
            $li.text(this);
            $li.click({index: index}, shiftTile);
            $ul.append($li);
        });

        var solvable = checkSolvable();

        $target.html($ul);
    };

    var checkSolvable = function () {
        var sum = 0;
        for (var i = 0; i < tiles.length; i++) {

        }
    };

    var shiftTile = function (event) {
        var index = event.data.index;

        var targetIndex = -1;
        if (index - 1 >= 0 && tiles[index - 1] == 0) { // check left
            targetIndex = index - 1;
        } else if (index + 1 < tiles.length && tiles[index + 1] == 0) { // check right
            targetIndex = index + 1;
        } else if (index - 3 >= 0 && tiles[index - 3] == 0) { //check up
            targetIndex = index - 3;
        } else if (index + 3 < tiles.length && tiles[index + 3] == 0) { // check down
            targetIndex = index + 3;
        }

        if (targetIndex != -1) {
            var temp = tiles[targetIndex];
            tiles[targetIndex] = tiles[index];
            tiles[index] = temp;
            renderTiles();
            //console.log("index: ",index);
            //console.log("targetIndex: ",targetIndex);
        }

        event.preventDefault();
    };

   renderTiles($('.eight-puzzle'));
//};

  //Hill-climbing
  //distance of a tile to various positions
  /*  var tileDs = [
        [0, 1, 2, 1, 2, 3, 2, 3, 4], [1, 0, 1, 2, 1, 2, 3, 2, 3], [2, 1, 0, 3, 2, 1, 4, 3, 2],
        [1, 2, 3, 0, 1, 2, 1, 2, 3], [2, 1, 2, 1, 0, 1, 2, 1, 2], [3, 2, 1, 2, 1, 0, 3, 2, 1],
        [2, 3, 4, 1, 2, 3, 0, 1, 2], [3, 2, 3, 2, 1, 2, 1, 0, 1], [4, 3, 2, 3, 2, 1, 2, 1, 0]
    ];
    //possible moved for a tile
    var tileMoves = [
        [3, 1], [4, 0, 2], [5, 1],
        [6, 0, 4], [1, 3, 5, 7], [8, 4, 2],
        [3, 7], [6, 4, 8], [7, 5]
    ];

    var moves = [
        [3, 1], [4, 0, 2], [5, 1],
        [6, 0, 4], [1, 3, 5, 7], [8, 4, 2],
        [3, 7], [6, 4, 8], [7, 5]
    ];*/

  $('#bfsalgo').on('click', function (e) {
        //console.log("BFS Algo BTN click!");
        startbfs();
  });

  $('#hillclimb').on('click', function (e) {
      //console.log("hill climb btn click!");
      starthillclimb();
  });

  $('#astar').on('click', function (e) {
      //console.log("a star btn click!");
      startastar();
  });

  $('#idastar').on('click', function (e) {
      //console.log("a star btn click!");
      startidastar();
  });

  function startbfs(){
    var npuzzle = document.querySelectorAll('[data-tile]');
    //console.log("starting bfs");
    let bfs_result = bfs_start(tiles);
    var i;
    for (i = 1; i < bfs_result.length; i++) {
      let zeroindex = bfs_result[i].findIndex(function(element){return element == 0;});
      //console.log(bfs_result[i].findIndex(function(element){return element == 0;}));
      setTimeout(function(){
        var npuzzle = document.querySelectorAll('[data-tile]');
        npuzzle[zeroindex].click();
        //console.log("puzzle location "+zeroindex+" clicked");
      },500*i);
    }
  }
  function starthillclimb(){
    var npuzzle = document.querySelectorAll('[data-tile]');
    //console.log("starting hill climbing");
    //let hill_result = hillclimb_hamming_start(tiles);
    let hill_result = hillclimb_manhattan_start(tiles);
    var i;
    for (i = 1; i < hill_result.length; i++) {
      let zeroindex = hill_result[i].findIndex(function(element){return element == 0;});
      //console.log(hill_result[i].findIndex(function(element){return element == 0;}));
      setTimeout(function(){
        var npuzzle = document.querySelectorAll('[data-tile]');
        npuzzle[zeroindex].click();
        //console.log("puzzle location "+zeroindex+" clicked");
      },500*i);
    }
  }
  function startastar(){
    var npuzzle = document.querySelectorAll('[data-tile]');
    let star_result = astar_start(tiles);
    var i;
    for (i = 1; i < star_result.length; i++) {
      let zeroindex = star_result[i].findIndex(function(element){return element == 0;});
      //console.log(star_result[i].findIndex(function(element){return element == 0;}));
      setTimeout(function(){
        var npuzzle = document.querySelectorAll('[data-tile]');
        npuzzle[zeroindex].click();
        //console.log("puzzle location "+zeroindex+" clicked");
      },500*i);
    }
  }
  function startidastar(){
    var npuzzle = document.querySelectorAll('[data-tile]');
    let star_result = idastar_start(tiles);
    var i;
    for (i = 1; i < star_result.length; i++) {
      let zeroindex = star_result[i].findIndex(function(element){return element == 0;});
      //console.log(star_result[i].findIndex(function(element){return element == 0;}));
      setTimeout(function(){
        var npuzzle = document.querySelectorAll('[data-tile]');
        npuzzle[zeroindex].click();
        //console.log("puzzle location "+zeroindex+" clicked");
      },500*i);
    }
  }
});
