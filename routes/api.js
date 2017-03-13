var express = require('express')
var router = express.Router()
var passport = require('../passport')
var users = require('../users')

// This route will create a user, but not create a session.
router.post('/register', function (req, res, next) {
  // Add the user to our data store
  var success = users.add(req.body.username, req.body.password);
  if (!success)
  {
    next(new Error('User could not be created.'));
    return;
  }
  res.sendStatus(200)
})

// This route will authenticate a user and create a session.
// If successful, req.user will now exist,
// and req.isAuthenticated() will return true
router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.sendStatus(200)
  }
);

router.get('/logout', function (req, res) {
  // Clear the session and unauthenticate the user
  req.logout()
  res.sendStatus(200)
});

router.get('/user', function (req, res) {
  // Check if user is logged in
  if (!req.isAuthenticated()) {
    res.sendStatus(403)
    return
  }
  // Send user information
  res.send(req.user)
})

router.get('/users', function (req, res) {
  if (!req.isAuthenticated()) {
    res.sendStatus(401)
  }
  res.json(users.getAll())
})

module.exports = router;
