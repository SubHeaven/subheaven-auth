const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const login = require('./routes/login');
const auth = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', login);
app.use('/auth', auth);

module.exports = app;