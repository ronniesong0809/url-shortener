const counterSchema = require('../models/counter')

const getUrlStats = async (req, res, next) => {
  let key = req.params.url

  counterSchema.findOne({ shortKey: key }, function (err, stats) {
    if (err) {
      res.status(500).json({ error: err })
      return next(err)
    }

    if (!stats) {
      res.status(404).json({ error: `unable to find /${key} stats` })
      return next()
    }

    res.status(200).json({ stats })
  })
}

const getAllUrlsStats = async (req, res, next) => {
  counterSchema.find({}, function (err, stats) {
    if (err) {
      res.status(500).json({ error: err })
      return next(err)
    }

    if (!stats) {
      res.status(404).json({ error: `unable to find /all stats` })
      return next()
    }

    let arr = []

    stats.forEach(function (element) {
      arr.push(element)
    })

    res.status(200).json(arr)
  })
}

module.exports = { getUrlStats, getAllUrlsStats }
