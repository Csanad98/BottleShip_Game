
var isMyTurn = false;

//global variables to store essential data about the board
var rows = 10;
var cols = 10;
var tileSize = 50;
var gameBoardContainer;

//will be sent from server, one player is 'a' the other is 'b'
//their tile ids will contain this string as idString
var playerID = "a";

//empty array to store ship objects of current client
var shipObjects = [];

//empty array to store enemy ship objects 
var enemyShipObjects = [];



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
makeGrid(gameBoardContainer1, playerID, true);
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


            if (boardArray[c][r] == 0 || boardArray[c][r] == undefined) {
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
shipTiles, surroundingTiles, hitTiles: array of tileid arrays
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
    //console.log(tileId);
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

        var shipTileIds = XYCollectionToTileIds(shipCoordinates, "a");
        var surrondingTileIds = XYCollectionToTileIds(surroundingTiles, "a");

        //create ship object and add it to the array of ship objects
        var curShipObj = new ShipObject(currentID, currentSize, shipTileIds, surrondingTileIds,[]);
        shipObjects.push(curShipObj);

        if (shipsPlaced === allShipProperties.length) {
            changeTextOnMessageBoard("All your ships have been placed. You can start the game.");
    
        }


    } else {
        alert("All your ships have been placed. You can start the game.");
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
    
        //create the enemy board in the html
        createEnemyBoard(enemyBoard);

        disableOnClickAndHoverForTiles(boardArray, "a");

        //first establish ws connection
        establishWSConnection();
        console.log("Inside startGame");

        //send message to server that this client is ready to play
        readyToStartGame();

        changeTextOnMessageBoard("Waiting for an Opponent to join the game and place ships");

        setEnemyBoardTitle();

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


function createEnemyBoard(enemyBoardContainer) {

    enemyBoardContainer.setAttribute("class", "gameBoard");

    //create the html grid
    makeGrid(enemyBoardContainer, "b");

    //global variable of enemy ship objects
    //enemyShipObjects = JSON.parse(JSON.stringify(shipObjects)); //create deep copy of ship objects

    //switchTileIdInShipObjectsArray(enemyShipObjects, "b");

};


//helper function to make the game work without server
//modify enemyShipObjects array so the tileids start with b instead of a

function switchTileIdInShipObjectsArray(shipObjects, newStringId) {

    for(var i = 0; i<shipObjects.length; i++) {
        var curShipObj = shipObjects[i];
        var curShipTiles = curShipObj.shipTiles;
        var curShipSurroundings = curShipObj.surroundingTiles;

        switchTileIdInTiles(curShipTiles, newStringId);
        switchTileIdInTiles(curShipSurroundings, newStringId);
    }

};




function switchTileIdInTiles(shipTiles, newStringId) {

    for (var i = 0; i<shipTiles.length; i++) {
        var curShipTileId = shipTiles[i];
        var curXY = calculateStartCoordinate(curShipTileId);
        var newTileId = XYToTileId(curXY, newStringId);
        shipTiles[i] = newTileId;
    }
};






var userMissedMessage = "You missed, no enemy ship is on this coordinate.";
//event handler for on clicks for guessing enemy ship locations
/* function guessAShip(tileId) {

    var shipId = shipIdFromTileId(tileId, enemyBoardArray);

   
    //todo
    //send query to server to check if there is an enemy ship there

    //for now use local enemyboard 

    //if the guessed tile has enemy ship
    if(isTileHit(enemyBoardArray, tileId)){
        tileHit(tileId); //then update the UI + add tileid to hittiles of ship obj

        //check if ship has been destroyed
        if(checkIfHitShipIsDone(enemyShipObjects, shipId)) {
            //if yes then reveal surrounding tiles
            revealSurroundingTiles(enemyShipObjects, shipId);

            //check if all ships have been destroyed
            if(checkIfAllShipsAreHit(enemyShipObjects)) {
                alert("You won, all ships have been destroyed.");
            }

        }
    
        //otheriwse alert the user that she missed
    } else {
        tileMissed(tileId);
        alert(userMissedMessage);
    }

}; */


function guessAShip(tileId) {

    if (isMyTurn === true) {

        var payload = {tile: tileId};
        sendGuess(payload);
        


    } else {

        alert("Please wait for your turn.");
    }
};


/*
function for updating 2D array and then rerendering tiles of a board when a tile is hit
also adds the hit tile to the corresponding ship object
tileId: id of tile which was hit
*/

function tileHit(tileId, shipId) {
    //console.log("tileid received to process as hit: "+tileId);

    var curTile = document.getElementById(tileId);
    curTile.setAttribute("class", "hitTile");
    curTile.onclick = function() {alreadyClickedOnTile()};

    //update ship object
    addHitTileToShipObj(shipObjects, tileId, shipId);

};

function tileHitWithoutAddingHitTilesToShipObj(tileId, shipId) {
    //console.log("tileid received to process as hit: "+tileId);

    var curTile = document.getElementById(tileId);
    curTile.setAttribute("class", "hitTile");
    curTile.onclick = function() {alreadyClickedOnTile()};

    //update ship object
    //addHitTileToShipObj(shipObjects, tileId, shipId);

};

//update UI tile element if it was guessed but no ship was there
function tileMissed(tileId) {
    var curTile = document.getElementById(tileId);
    curTile.setAttribute("class", "missedTile");
    curTile.onclick = function() {alreadyClickedOnTile()};
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


function alreadyClickedOnTile() {

    alert("You cannot guess this tile again, try another one.");
};


//disable clicks of a board (also disable hover)
function disableOnClickAndHoverForTiles(boardArray, idString) {

    for (var c = 0; c<boardArray.length; c++) {
        for(var r = 0; r<boardArray[c].length; r++ ) {

            var curTileId = idString + c + r;
            var curTile = document.getElementById(curTileId);

            curTile.onclick = null;

            //if the tile has no ship, then change its class to disable hover
            if (boardArray[c][r] === 0 || boardArray[c][r] == undefined) {
                curTile.setAttribute("class", "yourBoardCellNoHover");
            }
        }
    }
};


function disableOnClickOfEnemyBoard() {

    for (var c = 0; c<10; c++) {
        for(var r = 0; r<10; r++ ) {

            var curTileId = "b" + c + r;
            var curTile = document.getElementById(curTileId);

            curTile.onclick = null;
        }
    }

}




/*
I need functions to deal with ship objects:
- determine shipID from hit tile
- add hit tile to the ship object
- check if any unhit tiles are left from the ship
- disable onclicks for tiles that are hit/missed
- reveal surrounding tiles once all ship tiles have been hit, 
disable onclicks for these tiles
*/

//returns the id of the ship which is on this tile
//boardArray: which contains the ship
function shipIdFromTileId(tileId, boardArray) {
    var curXY = calculateStartCoordinate(tileId);
    var C = curXY[0];
    var R = curXY[1];
    var shipId = boardArray[C][R];
    return shipId;

};



/*
adds the tile id to the correct ship's ship object's hittiles array
returns: the updated shipObjects array
*/
function addHitTileToShipObj(shipObjects, tileId, shipId) {
    //console.log("shipObjects: "+ shipObjects);
    //console.log("addHitTileToShipObj params: ", shipObjects, tileId)
    
    //console.log("curShipId is: " + shipId);
    var curShip = shipObjects[shipId-1];
    curShip.hitTiles.push(tileId);
    //console.log("Current ship's hittiles: "+ curShip.hitTiles);

    return shipObjects;
};

/*
returns true if all tiles of a ship has been hit
assumes that the shipTiles and hitTiles arrays don't contain duplicates
false otherwise
*/
function checkIfHitShipIsDone(shipObjects, shipId) {
    var curShip = shipObjects[shipId-1];
    //console.log("curShip.shipTiles: "+curShip.shipTiles);
    //console.log("curShip stringify: "+JSON.stringify(curShip));
    if(curShip.shipTiles.length === curShip.hitTiles.length) {
        return true;
    }

    return false;
};


/*
returns true if all ships have been hit 
assumes that the shipTiles and hitTiles arrays don't contain duplicates
returns false otherwise
*/
function checkIfAllShipsAreHit(shipObjects) {
    for(var i = 0; i<shipObjects.length; i++) {
        var curShip = shipObjects[i];
        if(curShip.shipTiles.length !== curShip.hitTiles.length) {
            return false;
        }
    }

    return true;
};

/*
updates UI with the ship's surrounding tiles - with missedTile class
also "disables" onclick event with alreadyClickedOnTile function

!!!!this only works correctly for the enemyboard of the client 
because of onclick and params
*/
function revealSurroundingTiles(shipObjects, shipId) {

    var curShip = shipObjects[shipId-1];
    var surroundingTileIds = curShip.surroundingTiles;

    for(var i = 0; i<surroundingTileIds.length; i++) {
        var curTileId = surroundingTileIds[i];
        var curTile = document.getElementById(curTileId);
        curTile.setAttribute("class", "missedTile");
        curTile.onclick = function() {alreadyClickedOnTile()};
    }
};

/*
updates UI with the ship's surrounding tiles - with missedTile class
doesn't modify onlick as those are already disabled

!!!!this only works correctly for the own board of the client 
because of onclick and params
*/
function revealSurroundingTilesOwnBoard(surroundingTileIds) {
    for(var i = 0; i<surroundingTileIds.length; i++) {
        var curTileId = surroundingTileIds[i];
        var curTile = document.getElementById(curTileId);
        curTile.setAttribute("class", "missedTile");
        curTile.onclick = function() {alreadyClickedOnTile()};
        
    }

};

//returns a tileId string from an XY Coordinate array and the idstring(1 letter)
function XYToTileId(XYCoordinate, idString) {

    return idString + XYCoordinate[0] + XYCoordinate[1];
}

function XYCollectionToTileIds(XYCoordinates, idString) {
    var tileIds = [];

    for(var i = 0; i<XYCoordinates.length; i++) {
        var curTileId = XYToTileId(XYCoordinates[i], idString);
        tileIds.push(curTileId);
    }

    return tileIds;
}

//returns the array of the given ship's surrounding tile ids
function getSurroundingTileIds(shipObjects, shipId) {
    var curShip = shipObjects[shipId-1];
    return curShip.surroundingTiles;



}


//connected with messages.js
/*
params:
thisPlayerStarts: boolean

*/





/*
Messages part -  included here so functions can be easily accessed between the two parts


*/
//establish web socket connection with the server
const ws = new WebSocket("ws://localhost:3000"); //open web socket

//send connection message to server
function establishWSConnection() {

    //ws = new WebSocket("ws://localhost:3000"); //open web socket

    //when ws connection is established send a message to server about this
    (ws.onopen = function() {
        connect();

    })();
};


function connect() {
    let message = {messageType: "connect"};
    sendMessage(message);
};


 
//when a message is received from server,
//the function receivedMessage gets called to determine what type of
// message has been received
ws.onmessage = function (event) {
    //console.log("onmessage received: ", event.data);
    receivedMessage(event.data);
};



/*
converts message object to JSON and sends it to the server
*/
function sendMessage(message) {
    console.log("Sending this message: " + JSON.stringify(message));
    ws.send(JSON.stringify(message));
}


//sends readyToPlay message to server
function readyToStartGame() {

    let message = {messageType: "readyToPlay"};
    sendMessage(message);

}

//client tells the server if the client's ships are all down - game is over, 
//other player wins
function sendGameOver(tileId, shipId, surrondingTilesToSend) {

    let message = {messageType: "gameOver", payload: {hit: true, shipDestroyed: true, surrondingTiles: surrondingTilesToSend, tileId: tileId, shipId: shipId, abortedGame: false }};
    ws.send(JSON.stringify(message));

    
};

//when executed it means that this player won
function receiveGameOver(payload) {

    //console.log("received payload: "+payload);

    

    if(payload.abortedGame === false) {

        receieveGuessReply(payload);
        disableOnClickOfEnemyBoard();



        changeTextOnMessageBoard("You won! Congratulations! You will be redirected to the splash screen.");
    
        //alert("You won! Congratulations!");
        //alert("Now you will be redirected to the splash screen.");
        //send connection message
        //establishWSConnection();
        setTimeout(function(){ 
            window.open("splash", "_self");
        }, 7000);

    } else {
        changeTextOnMessageBoard("You won! ...since the other player quit. You will be redirected to the splash screen.");
        disableOnClickOfEnemyBoard();
        setTimeout(function(){ 
        window.open("splash", "_self");
    }, 7000);
    }

    

    


    


};



function gameStarts(thisPlayerStarts) {

    //based on param: update who starts the game
    isMyTurn = thisPlayerStarts;
    if(isMyTurn) {
        //alert("You can start the game!");
        changeTextOnMessageBoard("It's Your Turn");
    } else {
        //alert("The other player starts the game. Wait for your turn.");
        changeTextOnMessageBoard("Opponent's Turn");
    }
    
};


//whenever a message is received this gets executed
function receivedMessage(message) {
    //console.log(message);
    let serverMessage = JSON.parse(message);
    //console.log(serverMessage.messageType);

    switch(serverMessage.messageType) {

        //gameStarted received once you are paired with an oponent
        case "gameStarted":
            //console.log("inside gameStarts case");

            //youStart parameter boolean
            gameStarts(serverMessage.youStart);
            break;


        case "guess":
            //console.log(serverMessage.payload.tile);
            receieveGuess(serverMessage.payload.tile);
            break;

        case "guessReply":
            //console.log("guessReply got the following serverMessage: " + serverMessage)
            receieveGuessReply(serverMessage.payload);
            break;


        case "gameOver":

            //console.log(serverMessage.payload);

            receiveGameOver(serverMessage.payload);
            //if you receive this then it means you won
            //(When you send it, it means that you lost)
            break;


        /// other stuff
    }
}

/*
function for sending tileid to server which was clicked
params:
tileId: string of tileid which was guessed
*/
function sendGuess(payload) {

    isMyTurn = false;
    

    let message = {messageType: "guess", payload: payload}
    sendMessage(message);
}

/*
receive the tile id which was guess by the other player
uses correct and incorrect Guess functions to send replies

*/
function receieveGuess(tileId) {

    

    //convert tileid prefix string from b to a - when receiving a guess, you check
    //ship on your own board
    var tileXY = calculateStartCoordinate(tileId);
    var convertedTileId = XYToTileId(tileXY, "a");

    //console.log("This tile was guessed by the other player: " + convertedTileId);


    


     //if the guessed tileid by the user has one of the current user's ship
     if(isTileHit(boardArray, convertedTileId)){


        //then there is a ship, get the id of that ship
        var shipId = shipIdFromTileId(convertedTileId, boardArray);

        tileHit(convertedTileId, shipId); //then update the UI + add tileid to hittiles of ship obj

        //check if ship has been destroyed
        //console.log("shipObjects: " + shipObjects);
        //console.log("shipId: " + shipId);
        //console.log("checkIfHitShipIsDone(shipObjects, shipId): " + checkIfHitShipIsDone(shipObjects, shipId));
        if(checkIfHitShipIsDone(shipObjects, shipId)) {

            //if yes then reveal surrounding tiles for this client
            revealSurroundingTiles(shipObjects, shipId);

            

            //check if all ships have been destroyed
            if(checkIfAllShipsAreHit(shipObjects)) {
                //alert("You won, all ships have been destroyed.");

                changeTextOnMessageBoard("All your ships have been destroyed. You lost. You will be redirected to the splash screen.");

                //signal it to the other user that him/her won
                var surrondingTilesToSend = convertSurroundingTileIdsForEnemyBoard(getSurroundingTileIds(shipObjects, shipId));
            
            //correctGuessWithShipDestroy(tileId, shipId, surrondingTilesToSend);
                sendGameOver(tileId, shipId, surrondingTilesToSend);
                disableOnClickOfEnemyBoard();



                //notify this user that she lost and bring her to the splash screen

                //changeTextOnMessageBoard("All your ships have been destroyed. You lost.");
                //alert("All your ships have been destroyed. You lost.");
                //alert("Now you will be redirected to the splash screen.");

                //send connection message
                //establishWSConnection();
                setTimeout(function(){ 
                    window.open("splash", "_self");
                ; }, 7000);
                //exit the function, so the rest of the code doesn't get executed
                return;
            }


            /*send message back to other player through the server to indicate that 
            the ship is destroyed 

            */

            //get the surrounding tiles, and send them with the ws message
            var surrondingTilesToSend = convertSurroundingTileIdsForEnemyBoard(getSurroundingTileIds(shipObjects, shipId));
            //console.log("surrondingTilesToSend: " + surrondingTilesToSend);
            correctGuessWithShipDestroy(tileId, shipId, surrondingTilesToSend);


          
            //exit the function, so the rest of the function doesn't get executed
            return;
        }

        //this gets executed when ship was hit, but not the whole ship has been destroyed
        correctGuessNoShipDestroy(tileId, shipId);
    
    //otheriwse alert the user that she missed
    } else {
        //update local version
        tileMissed(convertedTileId);
        //alert(userMissedMessage);

        //send it to other player that she missed
        incorrectGuess(tileId);

        //it's your turn again
        isMyTurn = true;
        changeTextOnMessageBoard("It's Your Turn");


    }
    
}

/*
converts an array of surrounding tile ids to have the prefix "b"
needed for sending reply to other player so they can render the 
right board with the surrounding tiles
*/
function convertSurroundingTileIdsForEnemyBoard(surrondingTileIds) {
    var newSurroundingTileIds = [];
    for (var i = 0; i<surrondingTileIds.length; i++) {
        var tileXY = calculateStartCoordinate(surrondingTileIds[i]);
        var convertedTileId = XYToTileId(tileXY, "b");
        newSurroundingTileIds.push(convertedTileId);

    }

    return newSurroundingTileIds;
}

function correctGuessWithShipDestroy(tileId, shipId, surrondingTileIds) {
    let message = {messageType: "guessReply", payload: {hit: true, shipDestroyed: true, surrondingTiles: surrondingTileIds, tileId: tileId, shipId: shipId }};
    sendMessage(message);
};

function correctGuessNoShipDestroy(tileId, shipId) {
    //console.log("inside correctGuessNoShipDestroy");
    //console.log("inside correctGuessNoShipDestroy the tile id is: " + tileId);
    let message = {messageType: "guessReply", payload: {hit: true, shipDestroyed: false, tileId: tileId, shipId: shipId}};
    sendMessage(message);
};

function incorrectGuess(tileId) {
    let message = {messageType: "guessReply", payload: {hit: false, tileId: tileId}};
    sendMessage(message);
};

/*
reply to server after received a guess, 
reply contains info if the guessed tile was hit or not

*/
function receieveGuessReply(payload) {
    //console.log("Received payload with no stringify: " + payload);
    //console.log("Received payload with stringify: " + JSON.stringify(payload));
    //console.log("Received payload with stringify and parse: " + JSON.parse(JSON.stringify(payload)));
    //payload = JSON.parse(JSON.stringify(payload));
    if(payload.hit) {
        

        // Hit a ship

        //if the ship was destroyed 
        if(payload.shipDestroyed) {
            tileHitWithoutAddingHitTilesToShipObj(payload.tileId, payload.shipId); //then update the UI + add tileid to hittiles of ship obj
            //also reveal surroundings
            revealSurroundingTilesOwnBoard(payload.surrondingTiles);

            //otherwise only part of ship was hit
        } else {
            //console.log("I received this payload: " + payload);
            tileHitWithoutAddingHitTilesToShipObj(payload.tileId, payload.shipId);
        }

        //it's your turn again
        isMyTurn = true;
        changeTextOnMessageBoard("It's Your Turn");

    } else {
        changeTextOnMessageBoard("Opponent's Turn");
        // Guessed incorrectly

        //tell the user who guessed, that she missed, also mark the tile as missed
        //console.log("this should be the payload's tileid " + payload.tileId);
        tileMissed(payload.tileId);
        //alert(userMissedMessage);

    }






};

/*
changes the text displayed on the messageBoard in the html with the given string
*/
function changeTextOnMessageBoard(message) {

    var messageBoard = document.getElementById("messageBoard");
    messageBoard.innerHTML = message;
};



function setEnemyBoardTitle() {

    document.getElementById("enemyBoardTitle").innerHTML = "Enemy Board";

};

//function for full screen mode
var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  } 
}   