const statsModel = require('../models/urlStatsModel.js')
const { toISOString } = require('../lib/timeUtils.js')
const UAParser = require('ua-parser-js')
const axios = require('axios')

class UrlVisitsService {
  async getClientIp(req) {
    const ip =
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.socket.remoteAddress ||
      req.connection.remoteAddress ||
      null

    if (!ip) return { ip: null, ipInfo: { status: 'ip is null' } }

    try {
      const cleanIp = ip.includes(',') ? ip.split(',')[0].trim() : ip.trim()
      const finalIp = cleanIp.replace(/^::ffff:/, '')
      const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
      const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
      if (!ipv4Regex.test(finalIp) && !ipv6Regex.test(finalIp)) {
        return { ip: null, ipInfo: { status: 'ip is not valid' } }
      }

      const response = await axios.get(`http://ip-api.com/json/${finalIp}`)
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
      return { ip, ipInfo: { status: 'fetching IP details failed' } }
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
