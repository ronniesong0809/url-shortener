const statsModel = require('../models/urlStatsModel.js')

// GET /{:url}/stats
const getUrlStats = async (req, res) => {
  try {
    let key = req.params.url
    let stats = await statsModel.findOne({ shortKey: key })

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
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const [stats, total] = await Promise.all([
      statsModel.find({}, null, {
        sort: { createdAt: -1 },
        skip: skip,
        limit: limit
      }),
      statsModel.countDocuments({})
    ])

    if (!stats) {
      return res.status(404).json({ error: `unable to find /all stats` })
    }

    return res.status(200).json({
      stats: stats,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = { getUrlStats, getAllUrlsStats }
