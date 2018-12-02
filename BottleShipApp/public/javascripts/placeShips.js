var startGame = function() {
    alert("You are starting the game!");

    //TODO
    //iff all ships have been placed then:
    window.open("game.html", "_self");

}


var rows = 10;
var cols = 10;
var tileSize = 50;

// get the container for the board
var gameBoardContainer = document.getElementById("gameBoard");


//make the grid
for (var i = 0; i<cols; i++) {
    for(var e = 0; e<rows; e++) {

        //create new html element (div) and it to the gameboard
        var tile = document.createElement("div");
        gameBoardContainer.appendChild(tile);

        //add unique ids for each element based on row and column numbers
        tile.id = "t" + i + e;

        //set each grid tile's coordinates: multiples of the current row or column number
		var topPosition = e * tileSize;
        var leftPosition = i * tileSize;
        
        // use CSS absolute positioning to place each grid tile on the page
		tile.style.top = topPosition + 'px';
		tile.style.left = leftPosition + 'px';

        
    }
}


//drag and drop events
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

// grid for the board. ship sizes = 1,2,3 no ship = 0
yourBoard: [[0, 0, 0, 0, 0, 0, 0, 0],     // y = 0
       [0, 0, 0, 0, 0, 0, 0, 0],     // y = 1
       [0, 0, 0, 0, 0, 0, 0, 0],     // y = 2
       [0, 0, 0, 0, 0, 0, 0, 0],     // y = 3
       [0, 0, 0, 0, 0, 0, 0, 0],     // y = 4
       [0, 0, 0, 0, 0, 0, 0, 0],     // y = 5
       [0, 0, 0, 0, 0, 0, 0, 0]]