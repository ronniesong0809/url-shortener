const statsModel = require('../models/urlStatsModel.js')
const { toISOString } = require('../lib/timeUtils.js')
const UAParser = require('ua-parser-js')

class UrlVisitsService {
  getClientIp(req) {
    return req.ip ||
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      null
  }

  parseUserAgent(userAgent) {
    const result = new UAParser(userAgent).getResult()
    return {
      browser: {
        name: result.browser.name,
        version: result.browser.version,
        type: result.browser.type
      },
      engine: {
        name: result.engine.name,
        version: result.engine.version
      },
      os: {
        name: result.os.name,
        version: result.os.version
      },
      device: {
        vendor: result.device.vendor,
        model: result.device.model,
        type: result.device.type
      },
      cpu: result.cpu.architecture
    }
  }

  extractRequestData(req) {
    return {
      ip: this.getClientIp(req),
      userAgent: req.headers['user-agent'] || null,
      acceptLanguage: req.headers['accept-language'] || null,
      cookies: req.headers['cookie'] || null,
      referer: req.headers['referer'] || null
    }
  }

  async recordVisit(req, shortKey) {
    const requestData = this.extractRequestData(req)
    const metadata = requestData.userAgent ? this.parseUserAgent(requestData.userAgent) : {}

    return await statsModel.findOneAndUpdate(
      { shortKey },
      {
        $inc: { clicks: 1 },
        $push: {
          visits: {
            ...requestData,
            metadata,
            timestamp: toISOString()
          }
        }
      },
      { new: true, upsert: true }
    )
  }
}

module.exports = new UrlVisitsService()
