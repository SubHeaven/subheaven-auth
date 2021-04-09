const express = require('express');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');

const account = require('./routes/account');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/account', account);
app.use('/users', usersRouter);

module.exports = app;