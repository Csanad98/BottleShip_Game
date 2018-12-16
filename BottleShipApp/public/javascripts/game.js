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

//empty array to store ship objects
var shipObjects = [];



// get the container for the board
var gameBoardContainer1 = document.getElementById("board1");
//var gameBoardContainer2 = document.getElementById("board2");



function createBoardArray() {

    //create 2D array for internal representation of the board
    var boardArray = Array(rows);

    for (var i = 0; i<rows; i++) {
        boardArray[i] = Array(cols);

    }

    for (let i = 0; i<boardArray.length; i++) {
        for(let e = 0; e<boardArray[i].length; e++) {
            boardArray[i][e] = 0;
        }
    }

    return boardArray;
};

var boardArray = createBoardArray();

//create the two grids in the html
makeGrid(gameBoardContainer1, "a", true);
//makeGrid(gameBoardContainer2, "b");


//render the tiles based on the internal representation
//0: free/empty tile
//0<: ship is there, each ship will have a different number - a ship that spans through
//multiple tiles will have its number on multiple tiles
//<0: surronding of a ship: ship number with a minus, identifies the each ships' surronding 
//separately
//modifies the class of the tile based on the internal state of the board
function renderTilesFromArray(boardArray, idString) {
    for (var c = 0; c<boardArray.length; c++) {
        for(var r = 0; r<boardArray[c].length; r++ ) {

            var curTileId = idString + c + r;
            var curTile = document.getElementById(curTileId);


            if (boardArray[c][r] == 0 || boardArray[c][r] == undefined) {
                curTile.setAttribute("class", "yourBoardCell");


            } else if (boardArray[c][r] > 0) {
                curTile.setAttribute("class", "placedShip");
                
            } else if (boardArray[c][r] < 0) {
                curTile.setAttribute("class", "placedShipSurronding");

            }

            
        }
    }
    
};

/*
param: isPlaceShip
if true: assign placeAShip function to tile onclick
if false: assign guessAShip function to tile onclick

*/

function makeGrid(gameBoardContainer, idString, isPlaceShip){
    //make the grid
    for (var i = 0; i<boardArray.length; i++) {
        for(var e = 0; e<boardArray[i].length; e++) {

            //create new html element (div) and add it to the gameboard
            var tile = document.createElement("div");
            gameBoardContainer.appendChild(tile);

            //add unique ids for each element based on row and column numbers
            tile.id = idString + i + e;

            tile.setAttribute("class", "yourBoardCell");

            //set each grid tile's coordinates: multiples of the current row or column number
		    var topPosition = e * tileSize;
            var leftPosition = i * tileSize;
            
            if (isPlaceShip) {
             
                tile.onclick = function () {placeAShip(this.id)};
            
            } else {

                tile.onclick = function () {guessAShip(this.id)};
            }
            
 
            // use CSS absolute positioning to place each grid tile on the page
		    tile.style.top = topPosition + 'px';
            tile.style.left = leftPosition + 'px';
    
    }

}

};






// ship objects
// Initializing a class 
/*
shipId: integer
shipSize: int, number of tiles it takes
shipTiles, surroundingTiles, hitTiles: array of tile coordinate arrays
*/
class ShipObject {
    constructor(shipID, shipSize, shipTiles, surroundingTiles, hitTiles) {
        this.shipID = shipID;
        this.shipSize = shipSize;
        this.shipTiles = shipTiles;
        this.surroundingTiles = surroundingTiles;
        this.hitTiles = hitTiles;
    }
}

//ititialise all the user's ships (total 8)

var shipsPlaced = 0;
//var allShipIDs = [2,3,4,5,6,7,8,9]
//declare the (shipID, length_of_ship) array
var allShipProperties = [[1,5], [2,4], [3,3], [4,3], [5,2], [6,2], [7,1], [8,1]]


//how to place a ship
/*

1. we get the id of the cell which was clicked on the board

2. we have a global variable which determines if the ship is to be placed horizontally or vertically

3. we have the 2D array of the board: with positive numbers where there is a ship, 
negative where it's the surrounding of a ship, zero where it is empty

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
    var shipCoordinates = [];

    for(var i = 0; i< length; i++) {
        
        var newRow = row;
        newRow += i;
        
        var currentXY = [col, newRow];
        shipCoordinates.push(currentXY);
        
    };
    
    return shipCoordinates;

};

function calculateHorizontalShipTileCoordinates(startCoordinate, length) {
    var col = startCoordinate[0];
    var row = startCoordinate[1];
    var shipCoordinates = [];

    for(var i = 0; i< length; i++) {
        var newCol = col;
        newCol += i;
        
        var currentXY = [newCol, row];
        shipCoordinates.push(currentXY);
    };

    return shipCoordinates;


};


//shipCoordinates: array of coordinates of proposed ship coordinates
//returns an array of the coordinates of the surrounding tiles
//first coordinate should be the leftmost, last coordinate the rightmost
function calculateHorizontalShipSurroundingTileCoordinates(shipCoordinates) {

    var shipRow =shipCoordinates[0][1];
    var surrondingCoordinates = [];

    var belowRow = shipRow-1;
    var aboveRow = shipRow+1;

    var leftCol = shipCoordinates[0][0]-1;
    var rightCol = shipCoordinates[shipCoordinates.length-1][0]+1;

    //tiles right above and below the ship
    for(var i = 0; i<shipCoordinates.length; i++) {

        var curCol = shipCoordinates[i][0];
        var aboveXY = [curCol, aboveRow];
        var belowXY = [curCol, belowRow];

        surrondingCoordinates.push(aboveXY);
        surrondingCoordinates.push(belowXY);
    }


    //tiles on the left
    surrondingCoordinates.push([leftCol, aboveRow]);
    surrondingCoordinates.push([leftCol, shipRow]);
    surrondingCoordinates.push([leftCol, belowRow]);

    //tiles on the right
    surrondingCoordinates.push([rightCol, aboveRow]);
    surrondingCoordinates.push([rightCol, shipRow]);
    surrondingCoordinates.push([rightCol, belowRow]);

    return surrondingCoordinates;

};


function calculateVerticalShipSurroundingTileCoordinates(shipCoordinates) {

    var shipCol =shipCoordinates[0][0];
    var surrondingCoordinates = [];

    var prevCol = shipCol-1;
    var nextCol = shipCol+1;

    var rowAbove = shipCoordinates[0][1]-1;
    var rowBelow = shipCoordinates[shipCoordinates.length-1][1]+1;

    //tiles right next to the ship on the right and on the left
    for(var i = 0; i<shipCoordinates.length; i++) {
        
        var curRow = shipCoordinates[i][1];
        var leftXY = [prevCol, curRow];
        var rightXY = [nextCol, curRow];

        surrondingCoordinates.push(leftXY);
        surrondingCoordinates.push(rightXY);
    }


    //tiles on top
    surrondingCoordinates.push([prevCol, rowAbove]);
    surrondingCoordinates.push([shipCol, rowAbove]);
    surrondingCoordinates.push([nextCol, rowAbove]);

    //tiles in the bottom
    surrondingCoordinates.push([prevCol, rowBelow]);
    surrondingCoordinates.push([shipCol, rowBelow]);
    surrondingCoordinates.push([nextCol, rowBelow]);

    return surrondingCoordinates;

};


//returns true if the ship's coordinates are on the board
//false if any of the coordinates are outside of the board
//board: 2d array of board, at least 2x2
function checkIfShipIsOnBoard(shipCoordinates, board) {
    

    //indexing starts at 5 if the length is 10
    for(var i = 0; i<shipCoordinates.length; i++) {
        for(var j = 0; j <shipCoordinates[i].length; j++) {

            //column is negative
            if (shipCoordinates[i] < 0) {
                return false;
            }

            //row is negative
            if (shipCoordinates[i][j] < 0) {
                return false;
            }

            //column is outside of the board's max column number
            if(shipCoordinates[i]>= board.length) {
                return false;
            }

            //column is outside of the board's max row number
            if(shipCoordinates[i][j]>= board[0].length) {
                return false;
            }

        }
    }

    return true;



};

//returns true if the given ship coordinates are all zero on the board
//false otherwise
//board: 2D array of the board
//assumes that the ship coordinates are on the board
function checkIfShipIsOnZeros(shipCoordinates, board) {

    //iterate through all the ship tile coordinates
    for(var i = 0; i<shipCoordinates.length; i++) {
       
            //get column
            var curCol = shipCoordinates[i][0];

            //get row
            var curRow = shipCoordinates[i][1];

            //alert(curCol + ", "+ curRow);
            if(board[curCol][curRow] !== 0) {
                return false;
            }

    }

    return true;


};

//removes all the coordinates from the surrounding coordinates which are outside
//of the board
//returns the cleaned shipSurrounding Coordinates which are on the board
function removeSurroundingsOutsideTheBoard(shipSurroundingCoordinates, board) {

    var shipSurroundingCoordinatesOnBoard =[];
    //iterate through the surrounding cell coorinates
    for(var i = 0; i<shipSurroundingCoordinates.length; i++) {

        //if it's on the board then add it to the new array which will be returned
        if(isCoordinateOnBoard(shipSurroundingCoordinates[i], board)) {
            shipSurroundingCoordinatesOnBoard.push(shipSurroundingCoordinates[i]);
        }
    }

    return shipSurroundingCoordinatesOnBoard;


};

//returns true if the given coordinate is contained in the board
//false otherwise
//coordinate [col, row]
//board: [[],[],[]]
function isCoordinateOnBoard(coordinate, board) {
    var col = coordinate[0];
    var row = coordinate[1];

    if(col < 0 || row < 0) {
        return false;
    }

    if(col >= board.length) {
        return false;
    }

    if(row >= board[col].length) {
        return false;
    }

    return true;

};

//modifies the board: puts the shipId as value to the board's coordinates which
//match with the shipCoordinates
function putShipOnBoard(shipId, shipCoordinates, board){

    for(var i = 0; i<shipCoordinates.length; i++) {
        var col = shipCoordinates[i][0];
        var row = shipCoordinates[i][1];
        board[col][row] = shipId;
    }


    return board;

};

//modifies the board: puts the shipId*(-1) as value to the board's coordinates which
//match with the shipSurroundingCoordinates
function putShipSurroundingsOnBoard(shipId, shipSurroundingCoordinates, board){

    var surId = -1*shipId;

    for(var i = 0; i<shipSurroundingCoordinates.length; i++) {
        var col = shipSurroundingCoordinates[i][0];
        var row = shipSurroundingCoordinates[i][1];
        board[col][row] = surId;
    }


    return board;

};

//alerts user that she cannot place a ship here
function cannotPlaceShipHere() {
    alert("Sorry but you cannot place a ship here. Try elsewhere.");
};


function placeAShip(tileId) {
    //check whether there are any ships left to place
    if (shipsPlaced<allShipProperties.length){

        //get ship ID
        currentID = allShipProperties[shipsPlaced][0];
        //get ship size
        currentSize = allShipProperties[shipsPlaced][1];

        //get coordinates of the tile which was clicked
        var startXY = calculateStartCoordinate(tileId);

        //if global variable is currently true
        if (vertical) {

            //calculate vertical ship coordinates
            var shipCoordinates = calculateVerticalShipTileCoordinates(startXY,currentSize);
          
            //check if ship is on the board
            if(!checkIfShipIsOnBoard(shipCoordinates, boardArray)) {
                cannotPlaceShipHere();
                return;
            }

            //check if ship can be placed here - no other ships are in place
            if(!checkIfShipIsOnZeros(shipCoordinates, boardArray)) {
                cannotPlaceShipHere();
                return;
            }

            //we get here if ship can be placed at the given location
            //take care of the surrounding tiles

            //calculate the surrounding tile coordinates
            var surroundingTiles = calculateVerticalShipSurroundingTileCoordinates(shipCoordinates);

            //remove Surroundings Outside of The Board
            var surroundingTiles = removeSurroundingsOutsideTheBoard(surroundingTiles, boardArray);

            //all set
            //place the ship on the board - modify the array
            boardArray = putShipOnBoard(currentID, shipCoordinates, boardArray);


            //place the surrounding tiles
            boardArray = putShipSurroundingsOnBoard(currentID,surroundingTiles,boardArray);


            //rerender the html file
            renderTilesFromArray(boardArray,"a");

            //create the ship object and add it to the array of ship objects
            //var curShip = new ShipObject()


        //if horizontal
        } else {

            //calculate horizontal ship coordinates
            var shipCoordinates = calculateHorizontalShipTileCoordinates(startXY,currentSize);
            

            //check if ship is on the board
            if(!checkIfShipIsOnBoard(shipCoordinates, boardArray)) {
                cannotPlaceShipHere();
                return;
            }

            //check if ship can be placed here - no other ships are in place
            if(!checkIfShipIsOnZeros(shipCoordinates, boardArray)) {
                cannotPlaceShipHere();
                return;
            }

            //we get here if ship can be placed at the given location
            //take care of the surrounding tiles

            //calculate the surrounding tile coordinates
            var surroundingTiles = calculateHorizontalShipSurroundingTileCoordinates(shipCoordinates);

            //remove Surroundings Outside of The Board
            var surroundingTiles = removeSurroundingsOutsideTheBoard(surroundingTiles, boardArray);

            //all set
            //place the ship on the board - modify the array
            boardArray = putShipOnBoard(currentID, shipCoordinates, boardArray);


            //place the surrounding tiles
            boardArray = putShipSurroundingsOnBoard(currentID,surroundingTiles,boardArray);


            //rerender the html file
            renderTilesFromArray(boardArray,"a");

        }

        //increment ships placed to go to the next ship
        shipsPlaced += 1;
        {nextShip()};

        //create ship object and add it to the array of ship objects
        var curShipObj = new ShipObject(currentID, currentSize, shipCoordinates, surroundingTiles,[]);
        shipObjects.push(curShipObj);


    } else {
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



/*
Game functionalities overview

1. Start the game
- create enemy board
possibility of disabling onclick on the tile - based on turns
disable own board clicks

- different class/styles for tiles if they are hit/missed

2.Play
-Guess: onclick function 
 ->send coordinate
 ->get back from server: true false value:
 ->depending on hit/miss update the 2D array and rerender the board

- update own board: diff class/style for these tiles, depending on updates from server
rerender the board (but no need to touch the 2d array)


*/


/*
1. Starting the game steps
- replace the right column with the enemy board


*/

/*
Handles click event by the user on the startGame button
replaces the right column with the enemy board
*/
function startGame() {

    if (shipsPlaced === allShipProperties.length) {
        var enemyBoard = document.getElementById("board2");
    
        createEnemyBoard(enemyBoard);

        disableOnClickAndHoverForTiles(boardArray, "a");


        //todo
        //send my board array to server
        //also a collection of ship objects

    } else {
        alert("Place all your ships first to start the game.");
    }

    
    
};


/*
Construct enemy board
param: document-div element
returns: enemy board atatched to the given div 
*/

//create the 2D array for the client based, internal representation of the enemy board
//initalize all items to zero
var enemyBoardArray = createBoardArray();

//some functionalities will be moved to the server but for now they are here

//enemy board organization is the same as the own board (for now)
var enemyBoardArray = boardArray.slice(0); // create shallow copy

var enemyShipObjects = JSON.parse(JSON.stringify(shipObjects)); //create deep copy of ship objects

var myTurn = true;


function createEnemyBoard(enemyBoardContainer) {

    enemyBoardContainer.setAttribute("class", "gameBoard");

    //create the html grid
    makeGrid(enemyBoardContainer, "b");

};

var userMissedMessage = "You missed, no enemy ship is on this coordinate.";
//event handler for on clicks for guessing enemy ship locations
function guessAShip(tileId) {

   
    //todo
    //send query to server to check if there is an enemy ship there

    //for now use local enemyboard 

    //if the guessed tile has enemy ship
    if(isTileHit(enemyBoardArray, tileId)){
        tileHit(tileId); //then update the UI
    
        //otheriwse alert the user that she missed
    } else {
        tileMissed(tileId);
        alert(userMissedMessage);
    }

};


/*
function for updating 2D array and then rerendering tiles of a board when a tile is hit
params: 


tileId: id of tile which was hit
*/

function tileHit(tileId) {

    var curTile = document.getElementById(tileId);
    curTile.setAttribute("class", "hitTile");
    curTile.onclick = function() {alreadyClickedOnTile(tileId)};


};

//update UI tile element if it was guessed but no ship was there
function tileMissed(tileId) {
    var curTile = document.getElementById(tileId);
    curTile.setAttribute("class", "missedTile");
    curTile.onclick = function() {alreadyClickedOnTile(tileId)};
}

//checks the given tile coordinates on the given boardArray
//returns true if there is a ship placed there
//false otherwise
function isTileHit(boardArray, tileId) {

    var tileXY = calculateStartCoordinate(tileId);
    var C = tileXY[0];
    var R = tileXY[1];

    //cell with ship
    if (boardArray[C][R] > 0) {
        return true;

    //cell with ship surrounding  or empty cell
    } else {
        return false;
    }
}


function alreadyClickedOnTile(tileId) {

    alert("You already clicked on this tile, try another one.");
};


//disable clicks of a board (also disable hover)
function disableOnClickAndHoverForTiles(boardArray, idString) {

    for (var c = 0; c<boardArray.length; c++) {
        for(var r = 0; r<boardArray[c].length; r++ ) {

            var curTileId = idString + c + r;
            var curTile = document.getElementById(curTileId);

            curTile.onclick = null;

            //if the tile has no ship, then change its class to disable hover
            if (boardArray[c][r] == 0 || boardArray[c][r] == undefined) {
                curTile.setAttribute("class", "yourBoardCellNoHover");
            }
        }
    }
}


/*
I need functions to deal with ship objects:

- determine shipID from hit tile
- add hit tile to the ship object
- check if any unhit tiles are left from the ship
- disable onclicks for tiles that are hit
- reveal surrounding tiles once all ship tiles have been hit, 
disable onclicks for tehse tiles


*/

//returns the id of the ship which is on this tile
//boardArray: which contains the ship
function shipIdFromTileId(tileId, boardArray) {
    var curXY = startCoordinate(tileId);
    var C = curXY[0];
    var R = curXY[1];

    var shipId = boardArray[C][R];

    return shipId;

}










