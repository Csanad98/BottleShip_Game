const config = require('./config/config');
const uuid = require('uuid4');
const WebSocket = require('ws');
const WebServer = WebSocket.Server;
const Cookie = require('cookie');
const Database = require('./database');
const gameController = require('./gameController');

module.exports = (server) => {
    OnLoad(new WebServer({server}));
};

//messageTypes
// to connect to server:  messageType = "connect"
// to enter a game messageType = "readyToPlay"
// to finish the game messageType = "gameOver"
// to forward the guessmessageType = "guess"
// to forward the reply to the hit MessageType = "guessReply"
// if player quits unexpectidly MessageType = "playerQuit"

let OnLoad = (CurrentServer) => {
    let logging = config.websocket.logging;

    function processMessage(ws, message) {
        console.log(message);
        let payload = JSON.parse(message);

        if (payload.messageType) {
            if (payload.messageType === "connect") {
                //add user to database.json
                Database.addUser(ws.clientId, ws);
                //debug line for testing
                if (logging) console.log('Connected: %s from Client %s', message, ws.clientId);
                
            } else if (payload.messageType === "readyToPlay"){
                if (logging) console.log('ReadyToPlay: Client %s', ws.clientId);
                gameController.addPlayerToWaitingRoom(Database.getPlayer(ws.clientId));
                //evoke the game method, add user to waitingroom
            
            } else if (payload.messageType === "guess" || payload.messageType === "guessReply"){
                gameController.forwardMessageToOpponent(Database.getPlayer(ws.clientId), message);
            
            } else if (payload.messageType === "gameOver"){
                if (logging) console.log('Game over: Client %s', ws.clientId);
                //end the game
                gameController.gameOver(Database.getPlayer(ws.clientId));

            }else if (payload.messageType === "playerQuit"){
                gameController.RemovePlayer(Database.getPlayer(ws.clientId), message);
                if (logging) console.log('Client quit uneqpectedly: Client %s', ws.clientId);
            }

        } else {
            console.error("No message type set for socket message: " + message);
        }

    }


    let onConnect = (ws, req) => {

        let reqCookie = Cookie.parse(req.headers.cookie);

        if(reqCookie.userId) {
            ws.clientId = reqCookie.userId;
        } else {
            ws.clientId = uuid();
        }

        ws.isAlive = true;
        //server recieves a message
        ws.on('message', (message) => {
            //console.log(message);
            processMessage(ws, message);
            // ws.send(`Hello, you sent -> ${message}`);
        });

        ws.on('close', () => {
            if (logging) console.log("Client %s closed the connection.", ws.clientId);
        });

        ws.on('pong', () => {
            ws.isAlive = true;
        });
    };

    let sendPing = (ws) => {
        if (!ws.isAlive) {
            if (logging) console.log("Terminating Client %s due to inactivity.", ws.clientId);
            return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
    };

    let sendBroadcastToOthers = (ws, data) => {
        CurrentServer.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        })
    };

    let sendBroadcast = (data) => {
        console.log(`Sending broadcast with following data: ${data}`);
        CurrentServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        })
    };

    CurrentServer.on('connection', onConnect);
    CurrentServer.broadcast = sendBroadcast;

    const interval = setInterval(() => CurrentServer.clients.forEach(sendPing), config.websocket.timeInterval);
};