const express = require('express');
const log = require('debug')('subheaven-auth:route.account');
const path = require('path');
const router = express.Router();

const { validate } = require('../controllers/auth');

router.get('/login', async(req, res, next) => {
    log('Login page requested.');
    res.sendFile(path.resolve(__dirname + '/../public/login.html'));
});

router.post('/validate', validate);

module.exports = router;