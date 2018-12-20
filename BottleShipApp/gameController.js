const Game = require('./models/game');
const Player = require('./models/player');
const Database = require('./database');

// add players to waitingroom
var playersReadyToStart = [];

// create a game (including adding players)
// end game (if its aborted or won)

function addPlayerToWaitingRoom(player){
    console.log(player);
    if(playersReadyToStart.length >= 1){
        if(player === playersReadyToStart[0]) {
            console.log("Same player sent message again (reloaded the page)");
        } else {
            startNewGame(player, playersReadyToStart[0]);
            //playersReadyToStart.pop(playersReadyToStart[0]);
            playersReadyToStart = [];
        }
    } else {
        playersReadyToStart.push(player);
    }
}

function startNewGame(playerA, playerB) {
    let game = new Game(playerA, playerB);
    playerA.addOpponent(playerB);
    playerB.addOpponent(playerA);
    sendPlayerStartMessage(playerA, playerB);
    console.log("Game has started!");
}

function sendPlayerStartMessage(playerA, playerB){
    playerA.socket.send(JSON.stringify({messageType: "gameStarted", youStart: true}));
    playerB.socket.send(JSON.stringify({messageType: "gameStarted", youStart: false}));
}

function forwardMessageToOpponent(player, message){
    player.opponent.socket.send(message);
}

function gameOver(player){

    //player.opponent.socket.send(JSON.stringify({messageType: "gameOver", abortedGame: false}));
    removeOpponent(player);

}

function RemovePlayer(player){
    console.log("removeplayer function s");
    if (player.opponent != null){
        abortGame(player);
    }
    console.log("removeplayer function e");
}

function abortGame(player){
    console.log("abortgame function s");
    player.opponent.socket.send(JSON.stringify({messageType: "gameOver", payload: {abortedGame: true}}));
    removeOpponent(player);
    console.log("abortgame function e");
}

function removeOpponent(player){
    console.log("removeopponent function s");
    if (player.opponent != null){
        if (player.opponent.opponent !=null){
            player.opponent.opponent = null;
        }
        player.opponent = null;
    }
    console.log("removeopponent function e");
}

module.exports = {addPlayerToWaitingRoom, forwardMessageToOpponent, gameOver, RemovePlayer}