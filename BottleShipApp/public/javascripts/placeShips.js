var startGame = function() {
    alert("You are starting the game!");

    //TODO
    //iff all ships have been placed then:
    window.open("game.html", "_self");

}


var rows = 10;
var cols = 10;
var squareSize = 50;

// get the container for the board
var gameBoardContainer = document.getElementById("gameboard");


//make the grid


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