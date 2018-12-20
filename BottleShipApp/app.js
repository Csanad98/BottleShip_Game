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

app.get('/', (req, res) => {
    //updateStatistics();
    //console.log(distinctUsers); 
    res.render('splash.ejs', { distinctUsersPlayed: 1, waitingRoom: 3, fastestWinner:4});
})

app.get('/splash', (req, res) => {
    //updateStatistics();
    //console.log(distinctUsers);
    res.render('splash.ejs', { distinctUsersPlayed: 1, waitingRoom:2, fastestWinner: 3});
})

//app.use('/', indexRouter);
app.use('/play', playRouter);
//app.use('/splash', splashRouter);

module.exports = app;
