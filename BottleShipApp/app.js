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

if (config.logger.enabled) {
    app.use(logger(config.logger.format));
}

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(config.cookie.secret));
app.use(express.static(path.join(__dirname, 'public')));

// set the view engine to ejs
app.set('view engine', 'ejs');

//get statistics
var distinctUsers = Database.getPlayerCount();
var yourGames = 6;
var yourWins = 4;

app.get('/', (req, res) => {
    //example of data to render; here gameStatus is an object holding this information
    res.render('splash.ejs', { distinctUsersPlayed: distinctUsers, yourGamesCount: yourGames, yourWinsCount: yourWins });
})

app.get('/splash', (req, res) => {
    //example of data to render; here gameStatus is an object holding this information
    res.render('splash.ejs', { distinctUsersPlayed: distinctUsers, yourGamesCount: yourGames, yourWinsCount: yourWins });
})

//app.use('/', indexRouter);
app.use('/play', playRouter);
//app.use('/splash', splashRouter);



module.exports = app;
