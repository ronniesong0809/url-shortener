const { toHashCode, to62HEX } = require('../lib/hashUtils.js')
const urlModel = require('../models/shortUrlModel.js')
const { fetchMetadata } = require('../lib/metadataUtils.js')
const urlVisitsService = require('./urlVisitsService.js')
const { isExpired } = require('../lib/timeUtils.js')

const short2Long = async (req, res) => {
  try {
    let key = req.params.url
    let url = await urlModel.findOne({ shortKey: key })

    if (!url || (url.expiration > 0 && isExpired(url.updatedAt, url.expiration))) {
      return res.redirect(302, `${process.env.FRONTEND_BASE_URL}/${key}/expired`)
    }

    await urlVisitsService.recordVisit(req, key)
    return res.redirect(302, `${url.longUrl}`)
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const long2Short = async (req, res) => {
  try {
    if (!req.body || !req.body.url) {
      return res.status(422).json({ error: 'Missing required field: url' })
    }

    let url = req.body.url
    const metadata = await fetchMetadata(url, res.locals.urlResponse)
    const isExist = await urlModel.findOne({ longUrl: url })

    if (isExist) {
      let result = await urlModel.findOneAndUpdate(
        { longUrl: url },
        {
          $set: {
            expiration: req.body.expiration ? req.body.expiration : 0,
            metadata: {
              title: metadata.title,
              description: metadata.description,
              hostname: metadata.hostname
            }
          }
        },
        { new: true, runValidators: true }
      )

      return res.status(200).json({
        shortKey: result.shortKey,
        metadata: result.metadata,
        message: 'URL updated successfully'
      })
    }

    const key = await generateUniqueKey(url)
    const newUrl = await urlModel.create({
      shortKey: key,
      longUrl: url,
      metadata: {
        title: metadata.title,
        description: metadata.description,
        hostname: metadata.hostname
      },
      expiration: req.body.expiration ? req.body.expiration : 0
    })

    return res.status(201).json({
      shortKey: key,
      metadata: newUrl.metadata,
      message: 'URL created successfully'
    })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const deleteRecord = async (req, res) => {
  try {
    let key = req.path.substring(1)
    let result = await urlModel.deleteOne({ shortKey: key })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'URL not found' })
    }
    return res.status(200).json({ message: 'URL deleted successfully' })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

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

    if (!urls || urls.length === 0) {
      return res.status(404).json({ error: 'No URLs found' })
    }

    return res.status(200).json({
      content: urls,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      message: 'URLs retrieved successfully'
    })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const extendExpiration = async (req, res) => {
  try {
    if (!req.body || !req.body.key || typeof req.body.expiration !== 'number') {
      return res
        .status(422)
        .json({ error: 'Missing required fields: key and expiration (must be a number)' })
    }

    if (req.body.expiration < 0) {
      return res
        .status(400)
        .json({ error: 'Expiration must be 0 (never expires) or a positive number of days' })
    }

    const existingUrl = await urlModel.findOne({ shortKey: req.body.key })
    if (!existingUrl) {
      return res.status(404).json({ error: 'URL not found' })
    }

    const metadata = await fetchMetadata(existingUrl.longUrl)
    const result = await urlModel.findOneAndUpdate(
      { shortKey: req.body.key },
      {
        $set: {
          expiration: req.body.expiration,
          metadata: {
            title: metadata.title,
            description: metadata.description,
            hostname: metadata.hostname
          }
        }
      },
      { new: true, runValidators: true }
    )

    return res.status(200).json({
      shortKey: result.shortKey,
      expiration: result.expiration,
      metadata: result.metadata,
      message: 'URL expiration and metadata updated successfully'
    })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const getAllMetadata = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const [urls, total] = await Promise.all([
      urlModel.find(
        {},
        { shortKey: 1, metadata: 1, _id: 0 },
        {
          sort: { createdAt: -1 },
          skip: skip,
          limit: limit
        }
      ),
      urlModel.countDocuments({})
    ])

    if (!urls || urls.length === 0) {
      return res.status(404).json({ error: 'No URLs found' })
    }

    return res.status(200).json({
      content: urls,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      message: 'Metadata retrieved successfully'
    })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const generateUniqueKey = async (url) => {
  let key
  let i = 0
  let stopped = false
  while (!stopped) {
    key = to62HEX(toHashCode(url, i++))
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
  extendExpiration,
  getAllMetadata
}
