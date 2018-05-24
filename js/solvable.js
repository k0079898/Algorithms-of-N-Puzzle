window.onload = function() {
  init();
};

var isSolvable = function (map) {
    let count = 0;
    for(let i = 0 ; i < 8 ; i++) {
        for(let j = i + 1 ; j < 9 ; j++) {
            if(map[i] > map[j] && map[i]!=0 && map[j]!=0) count = count + 1;
        }
    }
    console.log(count);
    if(count % 2  == 0) return true;
    else return false;
}

function init() {
    let mapArray = [8, 1, 2, 0, 4, 3, 7, 6, 5];
    let solvable = isSolvable(mapArray);
    console.log("Solvable: ", solvable);
}
