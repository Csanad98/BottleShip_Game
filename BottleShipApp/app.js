'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config/config');
const Database = require('./database');
const gameController = require('./gameController');

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

//app.use('/', indexRouter);
app.use('/play', playRouter);
//app.use('/splash', splashRouter);

var distinctUsers = Database.getPlayerCount();
var playersWaiting = gameController.playersReadyToStart.length;
var leastMoves = 1;

//get statistics
function updateStatistics(){
    distinctUsers = Database.getPlayerCount();
    playersWaiting = gameController.playersReadyToStart.length;
    leastMoves = 2;
};

app.get('/', (req, res) => {
    updateStatistics();
    console.log(distinctUsers); 
    //example of data to render; here gameStatus is an object holding this information
    res.render('splash.ejs', { distinctUsersPlayed: distinctUsers, waitingRoom: playersWaiting, fastestWinner:leastMoves });
})

app.get('/splash', (req, res) => {
    updateStatistics();
    console.log(distinctUsers);
    //example of data to render; here gameStatus is an object holding this information
    res.render('splash.ejs', { distinctUsersPlayed: distinctUsers, waitingRoom: playersWaiting, fastestWinner: leastMoves });
})

module.exports = app;
