//assigns a userID - forward it to splash
const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.redirect(301, '/splash');
});

module.exports = router;