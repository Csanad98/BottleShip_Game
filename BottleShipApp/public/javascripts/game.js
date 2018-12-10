/* var startGame = function() {
    alert("You are starting the game!");

    //TODO
    //iff all ships have been placed then:
    window.open("game.html", "_self");

} */

//global variables to store essential data about the board
var rows = 10;
var cols = 10;
var tileSize = 50;
var gameBoardContainer;
var boardArray;

// get the container for the board
var gameBoardContainer1 = document.getElementById("board1");
var gameBoardContainer2 = document.getElementById("board2");

//create the two grids in the html
makeGrid(gameBoardContainer1);
makeGrid(gameBoardContainer2);

(function createBoardArray() {
    

    //create 2D array for internal representation of the board
    boardArray = Array(rows);

    for (var i = 0; i<rows; i++) {
        boardArray[i] = Array(cols);

    }

    for (let i = 0; i<boardArray.length; i++) {
        for(let e = 0; e<boardArray[i].length; e++) {
            boardArray[i][e] = 0;
        }
    }
})();





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


            if (boardArray[r][c] == 0 || boardArray[r][c] == undefined) {
                curTile.setAttribute("class", "yourBoardCell");


            } else if (boardArray[r][c] > 0) {
                curTile.setAttribute("class", "placedShip");
                
            } else if (boardArray[r][c] < 0) {
                curTile.setAttribute("class", "placedShipSurronding");

            }

            
        }
    }
    
};

function makeGrid(gameBoardContainer){
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
            tile.onclick = function () {placeCurrentShip(this.id)};
 
// // /// tile.onclick = function () {placeLongShips(this.id, 3, false)};
           //tile.onclick = function() {renderTilesFromArray(boardArray)};

            // use CSS absolute positioning to place each grid tile on the page
		    tile.style.top = topPosition + 'px';
            tile.style.left = leftPosition + 'px';
            

    }

}

};



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
//declare the (shipID, length_of_ship) array
var allShipProperties = [[2,5], [3,4], [4,3], [5,3], [6,2], [7,2], [8,1], [9,1]]


//how to place a ship
/*

1. we get the id of the cell which was clicked on the board

2. we have a global variable which determines if the ship is to be placed horizontally or vertically

3. we have the 2D array of the board: with positive numbers where there is a ship, negative where it's the surrounding of a ship, zero where it is empty

4a. we need to calculate the list of the tiles where the ship would be placed
4b: need to calculate the tiles which are the surrondings of the to be placed ship

5. rules to check:
5a: a ship can be placed only on zeros
5b: surroundings of ships can overlap
5c: surroundings of ships cannot cover other ships (follows from the previous two)
5d: ships can be placed only on the board

if click is on valid spot:
6: place the ship
6a: modify the 2d array
6b: render the html file

if not:
7: alert user


Notes: all checks/calculations should be done on the 2D array, once we find the spot to be correct we render the tiles to change their color
If we find the click to be invalid, then alert the user with this without rerendering anything


*/
//returns the start coordinat pair from tileid(String) format t31
//where 3 is the column and 1 is the row
function calculateStartCoordinate(tileId) {
    column = parseInt(tileId.charAt(1));
    row = parseInt(tileId.charAt(2));

    return [column, row];

};


//returns an array of the ship's tile coordinates, where it would be placed based on the
//provided coordinate
//startCoordinate: [col, row]
//length: integer value: num of tiles the ship should take
function calculateVerticalShipTileCoordinates(startCoordinate, length) {
    var col = startCoordinate[0];
    var row = startCoordinate[1];
    var shipCoordinates = new Array(length);

    for(var i = 0; i< length; i++) {
        var newRow = row;
        newRow += i;
        
        var currentXY = [col, newRow];
        shipCoordinates.push(currentXY);
    };

    return shipCoordinates;

};

function calculateHorizontalShipTileCoordinates(startCoordinate, length) {

};


//shipCoordinates: array of coordinates of proposed ship coordinates
//returns an array of the coordinates of the surrounding tiles
function calculateHorizontalShipSurroundingTileCoordinates(shipCoordinates) {

};


function calculateVerticalShipSurroundingTileCoordinates(shipCoordinates) {

};


//returns true if the ship's coordinates are on the board
//false if any of the coordinates are outside of the board
function checkIfShipIsOnBoard(shipCoordinates) {

};

//returns true if the given ship coordinates are all zero on the board
//false otherwise
function checkIfShipIsOnZeros(shipCoordinates) {

};





function placeCurrentShip(tileId) {
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

        //initialize variable
        var validMove = true;

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
                
                var column = parseInt(currentShipTiles[i].charAt(1));
                var row =   parseInt(currentShipTiles[i].charAt(2));
                boardArray[row][column] = currentID;



                //if vertical
                if (vertical) {

                    //if first tile
                    if(i === 0) {

                        //cell above
                        var aboveRow = row-1;
                        var cellAboveTileId = "t"+column+aboveRow;
                        currentShipSurroundingTiles.push(cellAboveTileId);
                        
                        
                        //cell to the left (and above)
                        var colLeft = column-1;
                        var cellLeftTileId = "t"+colLeft+aboveRow;
                        currentShipSurroundingTiles.push(cellLeftTileId);


                        //cell to the right (and above)
                        var colRight = column+1;
                        var cellRightTileId = "t"+colRight+aboveRow;
                        currentShipSurroundingTiles.push(cellRightTileId);


                    //if last tile
                    } else if (i === currentSize-1) {

                        //cell below
                        var belowRow = row+1;
                        var cellBelowTileId = "t"+column+belowRow;
                        currentShipSurroundingTiles.push(cellBelowTileId);
                        
                        
                        //cell to the left (and below)
                        var colLeft = column-1;
                        var cellLeftTileId = "t"+colLeft+belowRow;
                        currentShipSurroundingTiles.push(cellLeftTileId);


                        //cell to the right (and below)
                        var colRight = column+1;
                        var cellRightTileId = "t"+colRight+belowRow;
                        currentShipSurroundingTiles.push(cellRightTileId);


                    
                    } 
                    //all inbetween tiles
                    //also top and bottom tiles' side tiles


                     //cell to the left 
                    var colLeft = column-1;
                    var cellLeftTileId = "t"+colLeft+row;
                    currentShipSurroundingTiles.push(cellLeftTileId);


                    //cell to the right 
                    var colRight = column+1;
                    var cellRightTileId = "t"+colRight+row;
                    currentShipSurroundingTiles.push(cellRightTileId);

                    


                //if horizontal
                } else {
        
                    //if first tile
                    if(i === 0) {
                        var colLeft = column-1;
                        var cellLeftTileId = "t"+colLeft+row;
                        currentShipSurroundingTiles.push(cellLeftTileId);

                        var aboveRow = row-1;
                        var cellLeftAboveTileId = "t"+colLeft+aboveRow;
                        currentShipSurroundingTiles.push(cellLeftAboveTileId);


                        var belowRow = row+1;
                        var cellLeftBelowTileId = "t"+colLeft+belowRow;
                        currentShipSurroundingTiles.push(cellLeftBelowTileId);


                    //if last tile
                    } else if (i === currentSize-1) {
                        var colRight = column+1;
                        var cellRightTileId = "t"+colRight+row;
                        currentShipSurroundingTiles.push(cellRightTileId);

                        var aboveRow = row-1;
                        var cellRightAboveTileId = "t"+colRight+aboveRow;
                        currentShipSurroundingTiles.push(cellRightAboveTileId);


                        var belowRow = row+1;
                        var cellRightBelowTileId = "t"+colRight+belowRow;
                        currentShipSurroundingTiles.push(cellRightBelowTileId);
    
                    
                    }  

                    //all inbetween tiles, also below and above tiles for first and last

                     //cell above
                    var aboveRow = row-1;
                    var cellAboveTileId = "t"+column+aboveRow;
                    currentShipSurroundingTiles.push(cellAboveTileId);

                    //cell below
                    var belowRow = row+1;
                    var cellBelowTileId = "t"+column+belowRow;
                    currentShipSurroundingTiles.push(cellBelowTileId);
 


                
                }


                    



                

                //add surroundingTiles
                // manipulate row and column values to find neightbours if current cell is not an edge cell
                
                /* if(column == 9 ){
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
 */
            }
            
            //filter out duplicants in currentShipSurroundingTiles
            function onlyUnique(value, index, self) { 
                return self.indexOf(value) === index;
            }
            currentShipSurroundingTiles = currentShipSurroundingTiles.filter(onlyUnique);
        
            //remove tiles from surroundingTiles which are part of the ship or 
            //which are outofBound
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
            
            // update values of boardarray and disable tiles
            for (i = 0; i<currentShipSurroundingTiles.length; i++){
                var surColumn = currentShipSurroundingTiles[i].charAt(1);
                var surRow = currentShipSurroundingTiles[i].charAt(2);
                //var value = parseInt(currentID)*(-1);
                boardArray[surRow][surColumn] = -1;
                //document.getElementById(currentShipSurroundingTiles[i]).disabled = true;
            }
            newShip = new ShipObject(currentID,currentSize,currentShipTiles, currentShipSurroundingTiles, currentShipHitTiles, vertical)
            //increment ships placed to go to the next ship
            shipsPlaced += 1;
            renderTilesFromArray(boardArray);
            {nextShip()};
        }
} else{
    alert("All your ships have been placed. Press start to start the game.");
}
}

var vertical= false;

var rotate = function() {
    
    if (vertical == false){
        vertical = true;
        document.getElementById("curRotation").innerHTML = "Current rotation is: Vertical";
        alert("Now you can place your ship vertically.");
    
    } else {
        vertical = false;
        document.getElementById("curRotation").innerHTML = "Current rotation is: Horizontal";
        alert("Now you can place your ship horizontally.");
    }
}

//returns true if the ship's neightbouring cells are free
//false otherwise
function getNeighbours(currentShipTiles, vertical) {

    //array of tileids that surround the ship, the ship is described by the ids of the tiles
    //which are stored in the currentShipTiles
    var neighbours = Array(2*currentShipTiles.length+6);

    for(let i = 0; i<currentShipTiles.length; i++) {



    }
};

//display length of next ship
function nextShip(){

    //if there are no ships left
    if (shipsPlaced >= allShipProperties.length) {

        //then tell it to the user
        document.getElementById('nextShip').innerHTML = "No ships left.";

    } else {
        //otherwise update the field with the next ship's length
        var nextShipLength = "Next ship's length is " + allShipProperties[shipsPlaced][1];
        document.getElementById('nextShip').innerHTML = nextShipLength;
    }
    
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