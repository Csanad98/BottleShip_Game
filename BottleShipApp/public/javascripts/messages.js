

const ws = new WebSocket("ws://localhost:3000");


//when ws connection is established send a message to server about this
ws.onopen(connect); 

function connect() {
    let message = {messageType: "connect"};
    sendMessage(message);
};


ws.onmessage(receivedMessage); //when a message is received from server,
//the function receivedMessage gets called


/*
converts message object to JSON and sends it to the server
*/
function sendMessage(message) {
    ws.send(JSON.stringify(message));
}


//sends readyToPlay message to server
function readyToStartGame() {

    let message = {messageType: "readyToPlay"};
    sendMessage(message);

}

//client tells the server if the client's ships are all down - game is over, 
//other player wins
function sendGameOver() {

    let message = {messageType: "gameOver"};
    ws.send(JSON.stringify(message));
};

//when executed it means that this player won
function receiveGameOver() {

};

function gameStarts(thisPlayerStarts) {

};


//whenever a message is received this gets executed
function receivedMessage(message) {
    let serverMessage = JSON.parse(message);

    switch(serverMessage.messageType) {

        //gameStarted received once you are paired with an oponent
        case "gameStarted":

            //youStart parameter boolean
            gameStarts(serverMessage.youStart);


        case "guess":
            receieveGuess(serverMessage.tileId)

        case "guessReply":
            receieveGuessReply(serverMessage.payload)


        case "gameOver":

            receiveGameOver();
            //if you receive this then it means you won
            //(When you send it, it means that you lost)


        /// other stuff
    }
}

/*
function for sending tileid to server which was clicked
params:
tileId: string of tileid which was guessed
*/
function sendGuess(tileId) {
    let message = {messageType: "guess", tileId: tileId}
    send(message);
}

/*
receive the tile id which was guess by the other player
uses correct and incorrect Guess functions to send replies

*/
function receieveGuess(tileId) {
    //Check in game if something is on tileId
}

function correctGuess() {
    let message = {messageType: "guessReply", payload: {hit: true, extra: "What tiles to reveal"}}
    sendMessage(message);
};

function incorrectGuess() {
    let message = {messageType: "guessReply", payload: {hit: false}};
    sendMessage(message);
};

/*
reply to server after received a guess, 
reply contains info if the guessed tile was hit or not

*/
function receieveGuessReply(payload) {
    if(payload.hit) {
        // Hit a ship
    } else {
        // Guessed incorrectly
    }

}

