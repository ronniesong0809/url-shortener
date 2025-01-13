const UrlStats = require('../models/urlStatsModel')

class UrlStatsService {
  async getUrlStats(shortUrl) {
    return await UrlStats.findOne({ shortUrl })
  }

  async getAllUrlsStats() {
    return await UrlStats.find({})
  }

  async incrementCounter(shortUrl) {
    const counter = await UrlStats.findOne({ shortUrl })
    if (counter) {
      counter.visits += 1
      counter.lastVisit = new Date()
      return await counter.save()
    }
    
    return await UrlStats.create({
      shortUrl,
      visits: 1,
      lastVisit: new Date()
    })
  }
}

module.exports = new UrlStatsService() 