'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config/config');
const Database = require('./database');
const gameController = require('./gameController');
const webSocket = require('./websocket');

let indexRouter = require('./routes/index');
let playRouter = require('./routes/play');
let splashRouter = require('./routes/splash');

const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

if (config.logger.enabled) {
    app.use(logger(config.logger.format));
}

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(config.cookie.secret));
app.use(express.static(path.join(__dirname, 'public')));

// //app.use('/', indexRouter);
// app.use('/play', playRouter);
// //app.use('/splash', splashRouter);
// console.log("cccccccccc");
// var currentCookie = webSocket.currentClientCookie;
// console.log("ababab: "+ currentCookie);
//track of how many times a user (and their coookie) has visited the site

// var visitors = [[]];

// function incrementNumberOfVisits(){
//     var currentCookie = webSocket.currentClientCookie;
//     var cookieFound = False;
//     for(var i = 0; i<visitors.length; i++){
//         if (visitors[i][0] === currentCookie){
//             visitors[i][1] += 1;
//             cookieFound = True;
//         }
//     }
//     if (cookieFound === False){
//         let visitor = [currentCookie, 1];
//         visitors.append(visitor);
//     }
// }

// function retrieveNumberOfVisits(){
//     var currentCookie = webSocket.currentClientCookie;
//     console.log("retrieve no of visits: "+ currentCookie);
//     var currentCookie = webSocket.currentClientCookie;
//     for(var i = 0; i<visitors.length; i++){
//         if (visitors[i][0] === currentCookie){
//             return visitors[i][1];
//         }
//     }
//     return 1;
// }

var distinctUsers = Database.getPlayerCount();
var playersWaiting = gameController.playersReadyToStart.length;
var yourVisits = 1;

//get statistics
function updateStatistics(){
    distinctUsers = Database.getPlayerCount();
    playersWaiting = gameController.playersReadyToStart.length;
    yourVisits = 2;
};

app.get('/', (req, res) => {
    updateStatistics();
    //incrementNumberOfVisits();
    console.log(distinctUsers); 
    //example of data to render; here gameStatus is an object holding this information
    res.render('splash.ejs', { distinctUsersPlayed: distinctUsers, waitingRoom: playersWaiting, fastestWinner: yourVisits });
})

app.get('/splash', (req, res) => {
    updateStatistics();
    //incrementNumberOfVisits();
    console.log(distinctUsers);
    //example of data to render; here gameStatus is an object holding this information
    res.render('splash.ejs', { distinctUsersPlayed: distinctUsers, waitingRoom: playersWaiting, fastestWinner: yourVisits });
})

module.exports = app;
