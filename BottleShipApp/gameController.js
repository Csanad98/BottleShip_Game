const Game = require('./models/game');
const Player = require('./models/player')

// add players to waitingroom
var playersReadyToStart = [];

// create a game (including adding players)
// end game (if its aborted or won)

function addPlayerToWaitingRoom(player){
    if(playersReadyToStart.length >= 1){
        startNewGame(player, playersReadyToStart[0]);
    }


    playersReadyToStart.push(player);

}

function startNewGame(playerA, playerB) {
    let game = new Game(playerA, playerB);
    playerA.addOpponent(playerB);
    playerB.addOpponent(playerA);
    sendPlayerStartMessage(playerA, playerB);
    sendPlayerStartMessage(playerB);
}

function sendPlayerStartMessage(playerA, playerB){
    playerA.socket.send(JSON.stringify({messageType: "gameStarted", youStart: true}));
    playerB.socket.send(JSON.stringify({messageType: "gameStarted", youStart: false}));
}

function forwardMessageToOpponent(player, message){
    player.opponent.socket.send(message);
}

function gameOver(player){
    player.opponent.socket(JSON.stringify({messegeType: "GameOver"}));
}

module.exports = {addPlayerToWaitingRoom, forwardMessageToOpponent, gameOver}