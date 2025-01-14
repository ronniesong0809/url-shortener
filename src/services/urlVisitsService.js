const statsModel = require('../models/urlStatsModel.js')
const { toISOString } = require('../lib/timeUtils.js')

class UrlVisitsService {
  async recordVisit(req, shortKey) {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null
    let userAgent = req.headers['user-agent'] || null

    return await statsModel.findOneAndUpdate(
      { shortKey },
      {
        $inc: { clicks: 1 },
        $push: {
          visits: {
            ip,
            userAgent,
            timestamp: toISOString()
          }
        }
      },
      { new: true, upsert: true }
    )
  }
}

module.exports = new UrlVisitsService()
