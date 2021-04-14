const express = require('express');
const log = require('debug')('subheaven-auth:route.account');
const path = require('path');
const router = express.Router();

const { signin, validate, logout } = require('../controllers/auth');

router.get('/login', async(req, res, next) => {
    log('Login page requested.');
    console.log(path.resolve(__dirname + '/../public/login.html'));
    res.sendFile(path.resolve(__dirname + '/../public/login.html'));
});

router.get('/secret', validate, async(req, res, next) => {
    log('Secret page requested.');
    res.send('Você está na página secreta.<br><a href="/account/logout">Sair</a>');
});

router.post('/signin', signin);

router.get('/logout', logout);

module.exports = router;