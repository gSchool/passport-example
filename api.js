var pg = require('pg')
var connectionString = 'postgres://localhost/passport'
var fs = require('fs')

function runQuery (query, parameters) {
  return new Promise (function (resolve, reject) {
    pg.connect(connectionString, function (err, client, done) {
      if (err) {
        done();
        reject(err);
        return
      }
      client.query(query, parameters, function (err, results) {
        done();
        if (err) {
          reject(err);
          return
        }
        resolve(results)
      })
    })
  })
}

var getUserSql = fs.readFileSync('./sql/getUser.sql', 'utf8')
function getUser (username, password) {
  return runQuery(getUserSql, [username, password])
}

var createUserSql = fs.readFileSync('./sql/createUser.sql', 'utf8')
function createUser (username, password) {
  return runQuery(createUserSql, [username, password])
}

module.exports = {
  login: {
    create: createUser,
    read: getUser
  }
}
