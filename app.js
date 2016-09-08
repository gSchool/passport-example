var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// Passport's sessions requires express-session to work
var session = require('express-session');
// Require passport from our passport file
var passport = require('./passport');

var routes = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// THE ORDER OF THESE MIDDLEWARE MATTER
// cookieParser, bodyParser, and session need to come before passport
// cookieParser needs to come before session
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Configure express session
app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: false
}));
// Mount Passport middleware onto Express
app.use(passport.initialize());
// Mount Passport session middleware onto Express
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
