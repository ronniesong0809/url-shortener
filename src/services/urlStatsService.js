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
    
    // Generate dates for the last 10 days
    const dates = Array.from({ length: 10 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    const stats = await statsModel.aggregate([
      { $match: { shortKey: shortKey } },
      { $unwind: { path: '$visits', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: { $toDate: '$visits.timestamp' }
            }
          },
          visits: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: false,
          date: '$_id',
          visits: '$visits'
        }
      }
    ])

    const visitsMap = stats.reduce((acc, { date, visits }) => {
      acc[date] = visits
      return acc
    }, {})

    const filledStats = dates.map(date => ({
      date,
      visits: visitsMap[date] || 0
    }))

    return res.status(200).json({
      content: filledStats,
      message: 'Visit counts by date retrieved successfully'
    })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getUrlStats, getAllUrlsStats, getVisitCountsByDate }
