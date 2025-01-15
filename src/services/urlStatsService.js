const statsModel = require('../models/urlStatsModel.js')

const getUrlStats = async (req, res) => {
  try {
    let key = req.params.url
    let stats = await statsModel.findOne({ shortKey: key })

    if (!stats) {
      return res.status(404).json({ error: 'URL stats not found' })
    }

    return res.status(200).json({
      content: stats,
      message: 'URL stats retrieved successfully'
    })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

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

    if (!stats || stats.length === 0) {
      return res.status(404).json({ error: 'No URL stats found' })
    }

    return res.status(200).json({
      content: stats,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      message: 'URL stats retrieved successfully'
    })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const getVisitCountsByDate = async (req, res) => {
  try {
    const shortKey = req.params.shortKey
    const stats = await statsModel.aggregate(
      [
        { $match: { shortKey: shortKey } },
        { $unwind: '$visits' },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$visits.createdAt'
              }
            },
            visits: {
              $sum: 1
            }
          }
        },
        {
          $project: {
            _id: false,
            date: '$_id',
            visits: '$visits'
          }
        }
      ],
      { maxTimeMS: 60000, allowDiskUse: true }
    )
    return res.status(200).json({
      content: stats,
      message: 'Visit counts by date retrieved successfully'
    })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getUrlStats, getAllUrlsStats, getVisitCountsByDate }
