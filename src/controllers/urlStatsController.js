const counterSchema = require('../models/urlStatsModel.js')

// GET /{:url}/stats
const getUrlStats = async (req, res) => {
  try {
    let key = req.params.url
    let stats = await counterSchema.findOne({ shortKey: key })

    if (!stats) {
      return res.status(404).json({ error: `unable to find /${key} stats` })
    }

    return res.status(200).json({ stats })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// GET /all/stats
const getAllUrlsStats = async (req, res) => {
  try {
    let stats = await counterSchema.find({})

    if (!stats) {
      return res.status(404).json({ error: `unable to find /all stats` })
    }

    let arr = []
    stats.forEach(function (element) {
      arr.push(element)
    })

    return res.status(200).json(arr)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = { getUrlStats, getAllUrlsStats }
