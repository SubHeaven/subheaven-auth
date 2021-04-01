const express = require('express');
const log = require('debug')("subheaven-base:login")
const path = require('path');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    log(`Login page requested.`);
    res.sendFile(path.resolve(__dirname + '/../public/login.html'));
});

module.exports = router;