// Errors defined for the UPchieve app
var errors = {
  'EUIDNOTFOUND': 'No account with that id found.',
  'ESIDNOTFOUND': 'No session found',
  'ENOAUTH': 'Client has no authenticated session',
  'EBADDATA': 'Invalid request data'
}

// Appropriate response status codes for errors with properties with the given names
// matching the given values, including those not defined by UPchieve
var errorStatusCodes = {
  // User ID not found
  'code': {
    'EUIDNOTFOUND': 404,
    'ESIDNOTFOUND': 404,
    'ENOAUTH': 401,
    'EBADDATA': 400
  },
  // Mongoose validation failure
  'name': { 'ValidationError': 400 },
  '$allOthers': 500
}

// Errors that should not be reported to Sentry
var dontReport = [
  // Validation failed
  [ 'name', 'ValidationError' ],
  // User ID not found
  [ 'code', 'EUIDNOTFOUND' ],
  // Session not found
  [ 'code', 'ESIDNOTFOUND' ],
  // No client authentication
  [ 'code', 'ENOAUTH' ],
  // Invalid request data
  [ 'code', 'EBADDATA' ]
]

module.exports = {
  // codes, specific to the module that calls this function
  generateError: function (code, msg) {
    var err = new Error(msg || errors[code])
    err.code = code
    err.statusCode = this.statusFor(err)
    return err
  },

  statusFor: function (err) {
    return Object.entries(err).map(function (e1) {
      let [key1, value1] = e1
      if (key1 === '$allOthers') {
        return value1
      } else {
        return Object.entries(errorStatusCodes[key1]).find(function (e2) {
          let [key2] = e2
          return err[key1] === key2
        })[1]
      }
    }).find(function (c) {
      return (typeof (c)) !== 'undefined'
    })
  },

  ERR_USER_NOT_FOUND: 'EUIDNOTFOUND',
  ERR_SESSION_NOT_FOUND: 'ESIDNOTFOUND',
  ERR_NOT_AUTHENTICATED: 'ENOAUTH',
  ERR_INVALID_DATA: 'EBADDATA',

  dontReport
}
