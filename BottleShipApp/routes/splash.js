const express = require('express');
const router = express.Router();
const uuid = require('uuid4');

//cheks if a user exists, if not create userId
function checkOrCreateUserID(req, res) {
    if(req.cookies.userId) {
        console.log("Found the following userId: " + req.cookies.userId);
    } else {
        res.cookie("userId", uuid());
    }
}
// original
router.get('/', function (req, res, next) {
    checkOrCreateUserID(req, res);
    res.sendFile('splash.html', {root: './pages'});
});

//ejs
// app.set('view engine', 'ejs');

// router.get('/', function (req, res, next) {
//     checkOrCreateUserID(req, res);
//     res.render('splash.ejs',  { gamesInitialized: gameStatus.gamesInitialized, gamesCompleted: gameStatus.gamesCompleted });
// });


module.exports = router;

