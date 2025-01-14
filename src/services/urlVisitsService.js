const statsModel = require('../models/urlStatsModel.js')
const { toISOString } = require('../lib/timeUtils.js')
const UAParser = require('ua-parser-js')
const axios = require('axios')

class UrlVisitsService {
  async getClientIp(req) {
    const ip = req.ip ||
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      null
    
    if (!ip) return { ip: null }
    
    try {
      const cleanIp = ip.replace('::ffff:', '') // Handle IPv4 mapped to IPv6
      const response = await axios.get(`http://ip-api.com/json/${cleanIp}`)
      return {
        ip,
        ipInfo: {
          query: response.data.query,
          status: response.data.status,
          country: response.data.country,
          countryCode: response.data.countryCode,
          region: response.data.region,
          regionName: response.data.regionName,
          city: response.data.city,
          zip: response.data.zip,
          lat: response.data.lat,
          lon: response.data.lon,
          timezone: response.data.timezone,
          isp: response.data.isp,
          org: response.data.org,
          as: response.data.as
        }
      }
    } catch (error) {
      console.error('Error fetching IP details:', error.message)
      return { ip }
    }
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

  async extractRequestData(req) {
    return {
      ...(await this.getClientIp(req)),
      userAgent: req.headers['user-agent'] || null,
      acceptLanguage: req.headers['accept-language'] || null,
      cookies: req.headers['cookie'] || null,
      referer: req.headers['referer'] || null
    }
  }

  async recordVisit(req, shortKey) {
    const requestData = await this.extractRequestData(req)
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
