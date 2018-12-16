'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config/config');

let indexRouter = require('./routes/index');
let playRouter = require('./routes/play');
let splashRouter = require('./routes/splash');

const app = express();

if (config.logger.enabled) {
    app.use(logger(config.logger.format));
}

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/play', playRouter);
app.use('/splash', splashRouter);

module.exports = app;


// var player = function (socket, playerID) {
//     this.socket;
//     this.playerID;
// };

// /* every game has two players, identified by their WebSocket */

// var game = function (gameID, playerA, playerB) {
//     this.playerA = playerA;
//     this.playerB = playerB;
//     this.id = gameID;
//     this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
// };

// game.prototype.addPlayer = function (p) {

//     console.assert(p instanceof Object, "%s: Expecting an object (WebSocket), got a %s", arguments.callee.name, typeof p);

//     if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
//         return new Error("Invalid call to addPlayer, current state is %s", this.gameState);
//     }
// }
// //creating array for players
// playersSockets = [];
// //array storing currently active games
// gamesInProgress = [];
// var express = require("express");
// var http = require("http");
// var player = require(player);  //import player 

// //web sockets try
// var websocket = require("ws");

// var indexRouter = require("./routes/index");
// //takes 2nd argument from terminal
// var port = process.argv[2];
// var app = express();
// //app is an express instance (so it has funtions)
// //.use opens the public folder -- what does .use do in general?
// app.use(express.static(__dirname + "/public"));
// //creates a server and the server listens on port
// var server = http.createServer(app).listen(port);

// // app.get("/",(req,res) => {
// //     res.sendFile("splash.html", {root: "./public"})
// // });

// /* Pressing the 'Start the Game' button, returns this page */

// // app.get("/play",(req,res) => {
// //     res.sendFile("game.html", {root: "./public"})
// // });
// //.get matches the string and then it routes it (do stg with the request)
// app.get("/play", indexRouter);
// app.get("/", indexRouter);

// //web sockets try
// // app.use("/", function(req, res) {
// //     res.sendFile("public/splash.html", {root: "./"});
// // });
// //creating a new web socket server
// const wss = new websocket.Server({ server });
// //event handler, if there is a connection made on the webserver wss) then executes the function
// wss.on("connection", function(ws) {
//     //let's slow down the server response time a bit to make the change visible on the client side
//     //add the spcket to the list
//     //declare the new player
//     newPlayer = new player(ws, playersSockets.length);
//     playersSockets.push(newPlayer);
//     if (playersSockets.length%2 == 0){
//         playerA = playersSockets[playersSockets.length-2];
//         playerB = playersSockets[playersSockets.length-1];
//         gamesInProgress.push(new game(gamesInProgress.length, playerA, playerB))
//     }
//     console.log(playersSockets);
//     console.log(gamesInProgress);

//     //displays all incoming messages
//     ws.on("message", function incoming(message) {
//         console.log("[LOG] " + message);
//     });
// });
