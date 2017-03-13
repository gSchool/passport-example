var express = require('express');
var path = require('path');
var router = express.Router()

router.use(express.static(path.join(__dirname, '../public')));

router.get("*",
  function (req, res, next) {
    if (!req.isAuthenticated()) {
      // Don't let user see private files if not logged in
      // Act as if the next handler in this substack doesn't exist
      return next('route')
    } else {
      // Allow user to access private files if logged in
      // Run the next handler
      next()
    }
  },
  express.static(path.join(__dirname, '../private'))
);

module.exports = router