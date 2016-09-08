// Passport is a middleware to provide structure to
// common authenticate authorization tasks in Express
var passport = require("passport")
// LocalStrategy is a middleware for passport
// that offers a structured way to query
// your own data store
var Local = require("passport-local")
// Our in-memory data store for users
var users = require("./users")

// Configure passport to use localstrategy.
// Do localstrategy by searching your data store and returning
// an error or a user object
// Local strategy works by expecting a POST body with
// username and password
// Optionally you can error http://passportjs.org/docs#verify-callback
passport.use(new Local(function (username, password, done)
{
  var verified = users.authenticate(username, password)
  if (!verified)
  {
    // User did not pass authentication
    done(null, false)
  }
  var user = users.find(username)
  // User is authenticated, user will be passed to serializeUser
  done(null, user)
}))

// This is used to create the session string in the cookie.
// After authenticating, passport will store the sessoin id
// in your cookie for retrieval on the next request.
// Optionally you can error http://passportjs.org/docs#verify-callback
// Value given for user parameter comes from LocalStrategy
passport.serializeUser(function (user, done)
{
  // Value given to done comes out in deserializeUser's username parameter
  // Value should be unique to identify a user
  done(null, user.username)
})

// This is the oppposite of serializeUser.
// The client will give the server a cookie string that was
// created with serializeUser.
// It will then unencrypt the cookie string and retrieve a user
// using this function.
// Optionally you can error http://passportjs.org/docs#verify-callback
// The parameter username here comes from serializeUser's done
passport.deserializeUser(function (username, done)
{
  var user = users.find(username)
  // Value we pass to done is attached to req.user
  done(null, user)
})

module.exports = passport
