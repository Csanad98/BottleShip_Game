var startGame = function() {
    alert("You are starting the game!");

    //TODO
    //iff all ships have been placed then:
    window.open("game.html", "_self");

}


var rows = 10;
var cols = 10;
var tileSize = 50;

// get the container for the yourBoard
var youryourBoardContainer = document.getElementById("youryourBoard");


//create 2D array for internal representation of the yourBoard
var yourBoardArray = Array(rows);

for (var i = 0; i<rows; i++) {
    yourBoardArray[i] = Array(cols);
}

//yourBoardArray[2][1] = -1;

//render the tiles based on the internal representation
//0: free/empty tile
//0<: ship is there, each ship will have a different number - a ship that spans through
//multiple tiles will have its number on multiple tiles
//<0: surronding of a ship: ship number with a minus, identifies the each ships' surronding 
//separately
//modifies the class of the tile based on the internal state of the yourBoard
function renderTilesFromArray(yourBoardArray) {
    for (var r = 0; r<yourBoardArray.length; r++) {
        for(var c = 0; c<yourBoardArray[r].length; c++ ) {

            var curTileId = "t" + c + r;
            var curTile = document.getElementById(curTileId);
            //alert(curTileId);


            if (yourBoardArray[r][c] === 0) {
                curTile.setAttribute("class", "youryourBoardCell");


            } else if (yourBoardArray[r][c] > 0) {
                curTile.setAttribute("class", "placedShip");
                
            } else if (yourBoardArray[r][c] < 0) {
                curTile.setAttribute("class", "placedShipSurronding");

            }

            
        }
    }
    
}


//function 




//make the grid for your boardgGame
for (var i = 0; i<cols; i++) {
    for(var e = 0; e<rows; e++) {

        
            //create new html element (div) and add it to the gameyourBoard
            var tile = document.createElement("div");
            youryourBoardContainer.appendChild(tile);

            //add unique ids for each element based on row and column numbers
            tile.id = "t" + i + e;

            tile.setAttribute("class", "youryourBoardCell");

            //set each grid tile's coordinates: multiples of the current row or column number
		    var topPosition = e * tileSize;
            var leftPosition = i * tileSize;
        
            //tile.addEventListener("click", placeShip);
            //tile.onclick(placeShip());
            tile.onclick = function () {placeCurrentShip(this.id, rotated)};
 
// // /// tile.onclick = function () {placeLongShips(this.id, 3, false)};
           //tile.onclick = function() {renderTilesFromArray(yourBoardArray)};

            // use CSS absolute positioning to place each grid tile on the page
		    tile.style.top = topPosition + 'px';
            tile.style.left = leftPosition + 'px';
            

    }

}


// ship objects
// Initializing a class 
class ShipObject {
    constructor(shipID, shipSize, shipTiles, surroundingTiles, hitTiles, verticalOrientation ) {
        this.shipID = shipID;
        this.shipSize = shipSize;
        this.shipTiles = shipTiles;
        this.surroundingTiles = surroundingTiles;
        this.hitTiles = hitTiles;
        this.verticalOrientation = verticalOrientation;
    }
}

//ititialise all the user's ships (total 8)

var shipsPlaced = 0;
//var allShipIDs = [2,3,4,5,6,7,8,9]
//declare the (shipID, length of ship) array
var allShipProperties = [[2,5], [3,4], [4,3], [5,3], [6,2], [7,2], [8,1], [9,1]]

function placeCurrentShip(tileId, vertical) {
    //check whether there are any ships left to place
    if (shipsPlaced<allShipProperties.length){

        //get ship ID
        currentID = allShipProperties[shipsPlaced][0];
        //get ship size
        currentSize = allShipProperties[shipsPlaced][1]
        //get row and column of field clicked
        column = parseInt(tileId.charAt(1));
        row = parseInt(tileId.charAt(2));
        //initialise new array to hold the IDs of tiles where the ship is located
        currentShipTiles = new Array(currentSize);
        //check if vertical
        validMove = true;

        if (vertical == true) {
            for (i = 0; i<currentSize; i++) {
                newRow = row + i;
                //alert(newTileId) if the row is out of range;
                if (newRow > 9) {
                    alert("Invalid operation, tile out of range.")
                    validMove = false;
                    break;
                } else {
                    newTileId = "t" + column.toString() + newRow.toString();
                    //append new tileID to the array of currentShipTiles
                    currentShipTiles[i] = newTileId;
                    // document.getElementById(newTileId).style.backgroundColor = 'red';
                }
            }
        //horizontal
        } else {
            for (var i = 0; i<currentSize; i++) {
                newColumn = column + i; 
                //alert(newTileId) if column is out of range;
                if (newColumn > 9) {
                    alert("Invalid operation, tile out of range.");
                    validMove = false;
                    break;
                } else {
                    newTileId = "t" + newColumn.toString() + row.toString();
                    //append new tileID to the array of currentShipTiles
                    currentShipTiles[i] = newTileId;
                    // document.getElementById(newTileId).style.backgroundColor = 'red';      
                    }
            }
        }
        

        if (validMove == true){
            currentShipSurroundingTiles = [];
            currentShipHitTiles = 0;
            // render tiles to red one by one
            for (i = 0; i<currentSize; i++) {
                c = currentShipTiles[i].charAt(1);
                r = currentShipTiles[i].charAt(2);
                yourBoardArray[r][c] = currentID;
            //document.getElementById(currentShipTiles[i]).style.backgroundColor = 'red';
            }
            // render tiles to red one by one
            for (i = 0; i<currentSize; i++) {
                //disable tile
                //document.getElementById(currentShipTiles[i]).disabled = true;
                var column = parseInt(currentShipTiles[i].charAt(1));
                var row =   parseInt(currentShipTiles[i].charAt(2));
                yourBoardArray[row][column] = currentID;
                //document.getElementById(currentShipTiles[i]).style.backgroundColor = 'red';
                //add surroundingTiles
                // manipulate row and column values to find neightbours if current cell is not an edge cell
                
                if(column == 9 ){
                    var upColumn = column;
                }else{
                    var upColumn = column + 1;
                }

                if(column == 0){
                    var downColumn = column;
                } else{
                    var downColumn = column - 1;
                }
   
                if(row == 9){
                    var upRow = row;
                } else{
                    var upRow = row + 1;
                }

                if(row == 0){
                    var downRow = row;
                } else{
                    var downRow = row-1;
                }

                currentShipSurroundingTiles.push(("t" + downColumn + downRow));
                currentShipSurroundingTiles.push(("t" + downColumn + row));
                currentShipSurroundingTiles.push(("t" + downColumn + upRow ));
                currentShipSurroundingTiles.push(("t" + column + downRow));
                currentShipSurroundingTiles.push(("t" + column + upRow ));
                currentShipSurroundingTiles.push(("t" + upColumn + downRow));
                currentShipSurroundingTiles.push(("t" + upColumn + row));
                currentShipSurroundingTiles.push(("t" + upColumn + upRow ));

            }
            
            //filter out duplicants in currentShipSurroundingTiles
            function onlyUnique(value, index, self) { 
                return self.indexOf(value) === index;
            }
            currentShipSurroundingTiles = currentShipSurroundingTiles.filter(onlyUnique);
        
            //remove tiles from surroundingTiles which are part of the ship or which are outofBound
            for (i = 0; i<currentShipSurroundingTiles.length; i++){
                var column = currentShipSurroundingTiles[i].charAt(1);
                var row = currentShipSurroundingTiles[i].charAt(2);
                //remove elements out of Bound
                if ( currentShipSurroundingTiles[i].length > 3){
                    currentShipSurroundingTiles.splice(i,1);
                // remove elements which are part of the ship
                } else if (currentShipTiles.includes(currentShipSurroundingTiles[i])){
                    currentShipSurroundingTiles.splice(i,1);
                }

            }
            
            // update values of yourBoardarray and disable tiles
            for (i = 0; i<currentShipSurroundingTiles.length; i++){
                var surColumn = currentShipSurroundingTiles[i].charAt(1);
                var surRow = currentShipSurroundingTiles[i].charAt(2);
                //var value = parseInt(currentID)*(-1);
                yourBoardArray[surRow][surColumn] = -1;
                //document.getElementById(currentShipSurroundingTiles[i]).disabled = true;
            }
            newShip = new ShipObject(currentID,currentSize,currentShipTiles, currentShipSurroundingTiles, currentShipHitTiles, vertical)
            //increment ships placed to go to the next ship
            shipsPlaced += 1;
            renderTilesFromArray(yourBoardArray);
            {nextShip()};
        }
} else{
    alert("All your ships have been placed. Press start to start the game.");
}
}

var rotated = false;

var rotate = function() {
    alert("You rotated your ship");
    if (rotated == false){
        rotated = true;
    //if already rotated
    } else {
        rotated = false;
    }
}

//display length of next ship
function nextShip(){
    var nextShipLength = "Next ship's length is " + allShipProperties[shipsPlaced][1];
    document.getElementById('nextShip').innerHTML = nextShipLength;
};
// for (var i = 0; i<varShipIDs.length; i++) {
// myHelloShip = new ShipObject(12,2,myshipTiles, myshipTilesSurrounding, myshiphitTiles, true)
// var myshipTiles = [1, 2];
// var myshipTilesSurrounding = [3, 11, 12, 13];
// var myshiphitTiles = [1];
// myHelloShip = new ShipObject(12,2,myshipTiles, myshipTilesSurrounding, myshiphitTiles, true)

// var yourShips = function() {
//     alert("You have a ship with ID "+ myHelloShip.shipID + " size " + myHelloShip.shipSize + " tiles " + myHelloShip.shipTiles + " sour.tiles " + myHelloShip.surroundingTiles + " hit " + myHelloShip.hitTiles + " vertical " + myHelloShip.verticalOrientation);
// }