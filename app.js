var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if (req.timedout && req.headers.upgrade === 'websocket') {
    // Ignores websocket timeout.
    return;
  }

  var statusCode = err.status || 500;
  if (statusCode === 500) {
    console.error(err.stack || err);
  }
  if (req.timedout) {
    console.error('Request timeout: url=%s, timeout=%d, please check whether its execution time is too long, or the response callback is invalid.', req.originalUrl, err.timeout);
  }
  res.status(statusCode);
  // Do not output exception details by default.
  var error = {};
  if (app.get('env') === 'development') {
    // Displays exception stack on page if running in the development enviroment.
    error = err;
  }
  res.render('error', {
    message: err.message,
    error: error
  });
});


module.exports = app;
