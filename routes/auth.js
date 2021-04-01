const express = require('express');
const log = require('debug')("subheaven-base:auth")
const path = require('path');
const router = express.Router();

/* GET home page. */
router.post('/login', function(req, res, next) {
    let { user, pass } = req.body;
    log(`Login requested:`);
    log(`    ${user}`);
    if (user == 'SubHeaven' && pass == 'MinhaSenha') {
        res.status(200).send('Ok dude');
    } else {
        res.status(403).send('You should not pass');
    }
});

module.exports = router;