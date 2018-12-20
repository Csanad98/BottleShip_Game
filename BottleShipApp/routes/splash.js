const express = require('express');
const router = express.Router();
const uuid = require('uuid4');
const Database = require('../database');
const gameController = require('../gameController');

//statistics
var distinctUsers = Database.getPlayerCount();
var playersWaiting = gameController.playersReadyToStart.length;

function updateStatistics(){
    distinctUsers = Database.getPlayerCount();
    playersWaiting = gameController.playersReadyToStart.length;
};

//cheks if a user exists, if not create userId
function checkOrCreateUserID(req, res) {
    let userId = null;
    if(req.cookies.userId) {
        console.log("Found the following userId: " + req.cookies.userId);
        userId = req.cookies.userId;
    } else {
        userId = uuid();
        res.cookie("userId", userId);
    }
    Database.addUser(userId);
    let user = Database.getPlayer(userId);
    user.visited++;
    return user;

}
router.get('/', function (req, res, next) {
    let user = checkOrCreateUserID(req, res);
    updateStatistics();
    res.render('splash', { distinctUsers: distinctUsers, waitingRoom: playersWaiting, user: user});
});

module.exports = router;

