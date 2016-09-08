var express = require('express');
var router = express.Router();
var passport = require('../passport');
var users = require('../users')

router.get('/', function(req, res, next) {
  // Don't show login and register to logged in users
  if (req.isAuthenticated())
  {
    res.redirect('/dashboard');
    return;
  }
  res.render('index', { title: 'My Dashboard App' });
});

router.post('/register', function (req, res, next) {
  // Add the user to our data store
  var success = users.add(req.body.username, req.body.password);
  if (!success)
  {
    next(new Error('User could not be created.'));
    return;
  }
  // Send user to login page
  res.redirect('/');
})

// This route will authenticate a user and create a session.
// If successful, req.user will exist,
// redirect to /dashboard,
// and req.isAuthenticated() will return true
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
  })
);

router.get('/logout', function (req, res) {
  // Clear the session and unauthenticate the user
  req.logout();
  res.redirect('/');
});

router.get('/dashboard', function (req, res, next) {
  // Determine if the user is authorized to view the page
  if (!req.isAuthenticated()) {
    res.redirect('/');
    return;
  }
  // req.user will be the value from deserializeUser
  res.render('dashboard', { user: req.user })
});

module.exports = router;
