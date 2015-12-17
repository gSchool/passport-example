var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var passport = require('passport')
var LocalStrategy = require('passport-local')
var api = require('./api')

var app = express()

passport.use(new LocalStrategy(function (username, password, done) {
  api.login.read(username, password)
  .then(function (results) {
    done(null, results.rows[0])
  })
  .catch(function (error) {
    done(error)
  })
}))

passport.serializeUser(function (user, done) {
  done(null, JSON.stringify(user))
})

passport.deserializeUser(function (id, done) {
  done(null, JSON.parse(id))
})

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/login', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/secret')
    return
  }
  res.end('Please login')
})

app.post('/login',
  passport.authenticate('local'),
  function (req, res) {
    res.end('login successful: ' + req.user.username)
  }
)

app.get('/secret', function (req, res) {
  if (!req.isAuthenticated()) {
    res.redirect('/login')
    return
  }
  res.end('Very secret stuff here')
})

app.post('/register', function (req, res) {
  api.login.create(req.body.username, req.body.password)
  .then(function (results) {
    res.end('Register successful: ' + req.body.username)
  })
  .catch(function (error) {
    res.statusCode = 409
    res.send(error)
  })
})

app.post('/logout', function (req, res) {
  req.logout()
  res.end('logged out')
})

app.listen(8080)
