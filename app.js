var express = require('express')
var path = require('path')
var logger = require('morgan')
var bodyParser = require('body-parser')

// Required for user to stay logged in
var cookieParser = require('cookie-parser')
// Passport's sessions requires express-session to work
var session = require('express-session')
// Require passport from our passport file
var passport = require('./passport')

var staticRoutes = require('./routes/static')
var apiRoutes = require('./routes/api')
var cors = require("cors")

var PORT = process.env.PORT || 8080
var app = express()

// THE ORDER OF THESE MIDDLEWARE MATTER
// cookieParser, bodyParser, and session need to come before passport
// cookieParser needs to come before session
app.use(cors({
  origin: "http://localhost:8081",
  credentials: true,
}))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Enable cookie parsing
app.use(cookieParser())

// Configure express session
app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: false,
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 3600,
  }
}))
// Mount Passport middleware onto Express
app.use(passport.initialize())
// Mount Passport session middleware onto Express
app.use(passport.session())

app.use(function (req, res, next) {
  console.log(req.cookies)
  console.log(req.session)
  next()
})

app.use(staticRoutes)
app.use('/', apiRoutes)

app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.json({
    message: err.message,
    error: err
  })
})

app.listen(PORT, function () {
  console.log("Listening on port " + PORT + "...")
})

module.exports = app
