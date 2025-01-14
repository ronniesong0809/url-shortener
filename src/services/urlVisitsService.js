const statsModel = require('../models/urlStatsModel.js')

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
            timestamp: new Date()
          }
        }
      },
      { new: true, upsert: true }
    )
  }
}

module.exports = new UrlVisitsService()
