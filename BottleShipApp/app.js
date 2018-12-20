'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config/config');
const Database = require('./database');

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
var yourGames = 6;
var yourWins = 4;

//get statistics
function updateStatistics(){
    distinctUsers = Database.getPlayerCount();
    yourGames = 15;
    yourWins = 11;
};

app.get('/', (req, res) => {
    updateStatistics();
    console.log(distinctUsers); 
    //example of data to render; here gameStatus is an object holding this information
    res.render('splash.ejs', { distinctUsersPlayed: distinctUsers, yourGamesCount: yourGames, yourWinsCount: yourWins });
})

app.get('/splash', (req, res) => {
    updateStatistics();
    console.log(distinctUsers);
    //example of data to render; here gameStatus is an object holding this information
    res.render('splash.ejs', { distinctUsersPlayed: distinctUsers, yourGamesCount: yourGames, yourWinsCount: yourWins });
})

module.exports = app;
