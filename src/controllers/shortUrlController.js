const { toHashCode, to62HEX } = require('../lib/hashUtils.js')
const urlModel = require('../models/shortUrlModel.js')
const statsModel = require('../models/urlStatsModel.js')
const { fetchMetadata } = require('../lib/metadataUtils.js')
const dayjs = require('dayjs')
dayjs().format()

// GET /{:url}
const short2Long = async (req, res) => {
  try {
    let key = req.params.url
    let url = await urlModel.findOne({ shortKey: key })

    if (!url) {
      return res
        .status(404)
        .json({ error: 'unable to find URL to redirect to' })
    }

    let expire = dayjs(url.updatedAt).add(url.expiration, 'day')
    let today = dayjs(new Date())
    if (url.expiration !== 0 && expire.isBefore(today)) {
      return res.redirect(302, `${process.env.FRONTEND_BASE_URL}/${key}/error`)
    }

    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null
    let userAgent = req.headers['user-agent'] || null

    await statsModel.findOneAndUpdate(
      { shortKey: key },
      { 
        $inc: { clicks: 1 },
        $push: { 
          visits: { 
            ip: ip, 
            userAgent: userAgent,
            timestamp: new Date()
          }
        }
      },
      { new: true, upsert: true }
    )
    return res.redirect(302, `${url.longUrl}`)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// POST /shorten
const long2Short = async (req, res) => {
  try {
    if (!req.body || !req.body.url) {
      return res.status(422).json({ error: 'missing required parameter' })
    }

    let val = req.body.url
    const BASE_URL = process.env.BASE_URL || 'http://localhost:5000'

    const metadata = await fetchMetadata(val, res.locals.urlResponse)
    const isExist = await urlModel.findOne({ longUrl: val })
    if (isExist) {
      let result = await urlModel.findOneAndUpdate(
        { longUrl: val },
        {
          expiration: req.body.expiration ? req.body.expiration : 0,
          title: metadata.title,
          description: metadata.description,
          hostname: metadata.hostname,
        }
      )

      return res.status(200).json({
        url: `${BASE_URL}/${result.shortKey}`,
        metadata: metadata,
        message: 'successfully updated'
      })
    }

    const key = await generateUniqueKey(val)

    await urlModel.create({
      shortKey: key,
      shortUrl: `${BASE_URL}/${key}`,
      longUrl: val,
      title: metadata.title,
      description: metadata.description,
      hostname: metadata.hostname,
      expiration: req.body.expiration ? req.body.expiration : 0
    })

    const response = {
      url: `${BASE_URL}/${key}`,
      metadata: metadata
    }

    // Add warning if present
    if (res.locals.urlWarning) {
      response.warning = res.locals.urlWarning
    }

    return res.status(201).json(response)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// DELETE /{:url}
const deleteRecord = async (req, res) => {
  try {
    let key = req.path.substring(1)
    let result = await urlModel.deleteOne({ shortKey: key })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: `${key} not found` })
    }
    return res.status(200).json({ message: `${key} deleted` })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// GET /all
const displayAllRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const [urls, total] = await Promise.all([
      urlModel.find({}, null, {
        sort: { createdAt: -1 },
        skip: skip,
        limit: limit
      }),
      urlModel.countDocuments({})
    ])

    if (!urls) {
      return res.status(404).json({ error: `unable to find /all urls` })
    }

    return res.status(200).json({
      urls: urls,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// PUT /{:url}
const extendExpiration = async (req, res) => {
  try {
    if (!req.body || !req.body.expiration) {
      return res.status(422).json({ error: 'missing required parameter' })
    }

    let key = req.params.url
    const BASE_URL = process.env.BASE_URL || 'http://localhost:5000'

    let result = await urlModel.findOneAndUpdate(
      { shortKey: key },
      { expiration: req.body.expiration ? req.body.expiration : 0 }
    )

    if (!result) {
      return res.status(404).json({ error: `${key} not found` })
    }

    return res.status(200).json({
      url: `${BASE_URL}/${result.shortKey}`,
      message: 'successfully updated'
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

const generateUniqueKey = async (val) => {
  let key
  let i = 0
  let stopped = false
  while (!stopped) {
    key = to62HEX(toHashCode(val, i++))
    let shortExist = await urlModel.exists({ shortKey: key })
    if (!shortExist) {
      stopped = true
    }
  }
  return key
}

module.exports = {
  short2Long,
  long2Short,
  deleteRecord,
  displayAllRecords,
  extendExpiration
}
