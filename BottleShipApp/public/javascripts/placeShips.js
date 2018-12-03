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


//create 2D array for internal representation of the board
var boardArray = Array(rows);

for (var i = 0; i<rows; i++) {
    boardArray[i] = Array(cols);
}

//boardArray[2][1] = -1;

//render the tiles based on the internal representation
//0: free/empty tile
//0<: ship is there, each ship will have a different number - a ship that spans through
//multiple tiles will have its number on multiple tiles
//<0: surronding of a ship: ship number with a minus, identifies the each ships' surronding 
//separately
//modifies the class of the tile based on the internal state of the board
function renderTilesFromArray(boardArray) {
    for (var r = 0; r<boardArray.length; r++) {
        for(var c = 0; c<boardArray[r].length; c++ ) {

            var curTileId = "t" + c + r;
            var curTile = document.getElementById(curTileId);
            //alert(curTileId);


            if (boardArray[r][c] === 0) {
                curTile.setAttribute("class", "yourBoardCell");


            } else if (boardArray[r][c] > 0) {
                curTile.setAttribute("class", "placedShip");

            } else if (boardArray[r][c] < 0) {
                curTile.setAttribute("class", "placedShipSurronding");

            }

            
        }
    }
}


//function 




//make the grid
for (var i = 0; i<cols; i++) {
    for(var e = 0; e<rows; e++) {

        
            //create new html element (div) and add it to the gameboard
            var tile = document.createElement("div");
            gameBoardContainer.appendChild(tile);

            //add unique ids for each element based on row and column numbers
            tile.id = "t" + i + e;

            tile.setAttribute("class", "yourBoardCell");

            //set each grid tile's coordinates: multiples of the current row or column number
		    var topPosition = e * tileSize;
            var leftPosition = i * tileSize;
        
            //tile.addEventListener("click", placeShip);
            //tile.onclick(placeShip());
           
           // tile.onclick = function () {placeLongShips(this.id, 3, false)};
           tile.onclick = function() {renderTilesFromArray(boardArray)};

            // use CSS absolute positioning to place each grid tile on the page
		    tile.style.top = topPosition + 'px';
            tile.style.left = leftPosition + 'px';
            

    }

}







//click event listener function for placing individual ships
function placeShip(tileId) {
    alert("You clicked on tile: " + tileId);
    document.getElementById(tileId).style.backgroundColor = 'red';
    
}

//based on the ship coordinates calculates the surronding tile coordinates
//updates the classes of these tiles to be 'placedShipSurronding'
function updateShipSurrondings(shipCoordinates) {



}

//placing multiple tile long ships
//length: num of tiles the ship takes
//vertical: boolean, true if it's vertical, false if it's horizontal
function placeLongShips(tileId, length, vertical) {

    var invalidTile = "You cannot place a ship here. Please try again.";

    //alert("You clicked on tile: " + tileId);

    var column = parseInt(tileId.charAt(1));
    var row = parseInt(tileId.charAt(2));
    var newrow = row;
    var newcol = column;


    if (vertical) {
        for (var i = 0; i<length; i++) {
            var newTileId = "t" + column.toString() + newrow.toString();
            //alert(newTileId);
            if (newrow < rows) {
                document.getElementById(newTileId).style.backgroundColor = 'red';
            } else {
                alert(invalidTile);
            }
            
            newrow +=1;
        }
      
    //horizontal
    } else {
        for (var i = 0; i<length; i++) {
            var newTileId = "t" + newcol.toString() + row.toString();
            //alert(newTileId);
            if (newcol < cols) {
                document.getElementById(newTileId).style.backgroundColor = 'red';
            } else {
                //undo the styling of the tiles
                for (var e = i-1; e>=0; e--) {
                    newcol--;
                    var newTileId = "t" + newcol.toString() + row.toString();

                    //alert(newTileId);


                    
                    
                    document.getElementById(newTileId).style.backgroundColor = 'grey';
                    

                }

                //tell the user that (s)he can't place a ship here
                alert(invalidTile);

                //break out from the for loop
                break;

            }
            
            newcol +=1;
        }

    }

    

}



//drag and drop events
/*function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}*/



//ship objects
var i = 0