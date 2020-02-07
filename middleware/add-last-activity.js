const User = require('../models/User.js')

function addLastActivity(req, res, next) {
  if (req.user) {
    const { id, lastActivityAt } = req.user
    const todaysDateInMS = Date.now()
    const oneDayElapsed = 1000 * 60 * 3
    const lastActivityInMS = new Date(lastActivityAt).getTime()

    if (lastActivityInMS + oneDayElapsed <= todaysDateInMS) {
      const todaysDateFormatted = new Date(todaysDateInMS)
      User.updateOne({ _id: id }, { lastActivityAt: todaysDateFormatted })
        .then(() => next())
        .catch(err => next(err))
    } else {
      next()
    }
  } else {
    next()
  }
}

module.exports = addLastActivity