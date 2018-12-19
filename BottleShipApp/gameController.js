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
            console.log("Same player sent message again");
        } else {
            startNewGame(player, playersReadyToStart[0]);
            playersReadyToStart.pop(playersReadyToStart[0]);
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
    player.opponent.socket.send(JSON.stringify({messegeType: "gameOver", abortedGame: false}));
    // delete both player objects from the database
    Database.removePlayer(player.playerId);
    Database.removePlayer(player.opponent.playerId);
}

function RemovePlayer(player){
    if (player.opponent != null){
        abortGame(player);
    }
}

function abortGame(player){
    player.opponent.socket.send(JSON.stringify({messegeType: "gameOver", abortedGame: true}));
    removeOpponent(player);
}

function removeOpponent(player){
    if (player.opponent != null){
        if (player.opponent.opponent !=null){
            player.opponent.opponent = null;
        }
        player.opponent = null;
    }
}

module.exports = {addPlayerToWaitingRoom, forwardMessageToOpponent, gameOver, RemovePlayer}