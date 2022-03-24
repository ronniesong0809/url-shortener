const { toHashCode, to62HEX } = require('../utils/util')
const urlModel = require('../models/url')
const counterSchema = require('../models/counter')
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

    await counterSchema.findOneAndUpdate(
      { shortKey: key },
      { $inc: { clicks: 1 }, ip: ip, userAgent: userAgent },
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
    let regex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/

    if (!val.match(regex)) {
      return res.status(422).json({ error: 'please enter a valid url' })
    }

    const BASE_URL = process.env.BASE_URL || 'http://localhost:5000'

    let longExist = await urlModel.findOne({ longUrl: val })
    if (longExist) {
      let result = await urlModel.findOneAndUpdate(
        { longUrl: val },
        { expiration: req.body.expiration ? req.body.expiration : 0 }
      )

      return res.status(200).json({
        url: `${BASE_URL}/${result.shortKey}`,
        message: 'successfully updated'
      })
    }

    let key = await generateUniqueKey(val)

    await urlModel.create({
      shortKey: key,
      shortUrl: `${BASE_URL}/${key}`,
      longUrl: val,
      expiration: req.body.expiration ? req.body.expiration : 0
    })

    return res.status(201).json({
      url: `${BASE_URL}/${key}`
    })
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
    let urls = await urlModel.find({}, null, { sort: { createdAt: -1 } })

    if (!urls) {
      return res.status(404).json({ error: `unable to find /all urls` })
    }

    let arr = []
    urls.forEach(function (element) {
      arr.push(element)
    })

    return res.status(200).json(arr)
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
