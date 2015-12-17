var express = require('express')
//These 3 middlewares are required to use passport
//with sessions
var session = require('express-session')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
//Require passport
var passport = require('passport')
//LocalStrategy is a middleware for passport
//that offers a structured way to query
//your own database
var LocalStrategy = require('passport-local')
var api = require('./api')

var app = express()

//configure passport to use localstrategy
//Do localstrategy by querying postgres and returning
//an error or a user object
//http://passportjs.org/docs#verify-callback
passport.use(new LocalStrategy(function (username, password, done) {
  api.login.read(username, password)
  .then(function (results) {
    //success on verify callback
    done(null, results.rows[0])
  })
  .catch(function (error) {
    //error on verify callback
    done(error)
  })
}))

//This is used to create the session string in the cookie
//After authenticating, passport will store the sessoin id
//in your cookie
passport.serializeUser(function (user, done) {
  done(null, JSON.stringify(user))
})

//this is the oppposite of serializeUser
//The client will give the server a cookie string that was
//created with serializeUser.
//It will then unencrypt the cookie string and retrieve the user
//using this function
passport.deserializeUser(function (id, done) {
  done(null, JSON.parse(id))
})

//THE ORDER OF THESE MIDDLEWARE MATTER
//cookieParser, bodyParser, and session need to come before passport
//cookieParser needs to come before session
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

//Tell express to use passport as a middleware
app.use(passport.initialize())
//Tell express we want passport to handle sessions
app.use(passport.session())

//This route is a chance for you to get the user
//to type in a username and password
app.get('/login', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/secret')
    return
  }
  res.end('Please login')
})

//This route is a chance for the user to authenticate
//and start a new session
app.post('/login',
  passport.authenticate('local'),
  function (req, res) {
    res.end('login successful: ' + req.user.username)
  }
)

//This route can only be seen by people authenticated
//If they are not, kick them back to /login
app.get('/secret', function (req, res) {
  if (!req.isAuthenticated()) {
    res.redirect('/login')
    return
  }
  res.end('Very secret stuff here')
})

//This route is a chance for the user to register a new user
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

//This route will remove the current session
//After hitting this route, the user will have to
//login again to authenticate
app.post('/logout', function (req, res) {
  req.logout()
  res.end('logged out')
})

app.listen(8080)
