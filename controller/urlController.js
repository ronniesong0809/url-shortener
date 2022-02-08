const { toHashCode, to62HEX } = require('../utils/util')
const urlModel = require('../models/url')
const counterSchema = require('../models/counter')

const short2Long = (req, res, next) => {
  let key = req.params.url

  urlModel.findOne({ shortKey: key }, function (err, url) {
    if (err) {
      res.status(500).json({ error: err })
      return next(err)
    }
    if (!url) {
      res.status(404).json({ error: 'unable to find URL to redirect to' })
      return next()
    }

    let expire = new Date(url.createdDate)
    expire.setDate(expire.getDate() + url.expiration)

    if (url.expiration != 0 && expire <= new Date()) {
      res.status(410).json({ error: 'this URL is expired' })
      return next()
    }

    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null

    counterSchema.findOneAndUpdate(
      { shortKey: key },
      { $inc: { clicks: 1 }, ip: ip },
      { new: true, upsert: true },
      function (err) {
        if (err) {
          res.status(500).json({ error: err })
          return next(err)
        }

        res.redirect(302, `${url.longUrl}`)
        next()
      }
    )
  })
}

const long2Short = async (req, res, next) => {
  if (!req.body || !req.body.url) {
    res.status(422).json({ error: 'missing required parameter' })
    return next()
  }

  const BASE_URL = process.env.BASE_URL || 'http://localhost:5000'
  let val = req.body.url
  let key = await generateUniqueKey(val)

  let longExist = await longUrlExist(val)
  if (longExist) {
    res.status(200).json({
      url: `${BASE_URL}/${longExist.shortKey}`,
      message: 'url already exists'
    })
    return next()
  }

  let expire = req.body.expiration ? req.body.expiration : 0

  urlModel.create(
    {
      shortKey: key,
      shortUrl: `${BASE_URL}/${key}`,
      longUrl: val,
      expiration: expire
    },
    function (err) {
      if (err) {
        res.status(500).json({ error: err })
        return next(err)
      }
      res.status(201).json({ url: `${process.env.BASE_URL}/${key}` })
    }
  )
}

const deleteRecord = async (req, res, next) => {
  let key = req.path.substring(1)

  urlModel.deleteOne({ shortKey: key }).then((result) => {
    if (result.deletedCount == 0) {
      res.status(404).json({ error: `${key} not found` })
      return next()
    }
    res.status(200).json({ message: `${key} deleted` })
  })
}

const displayAllRecords = (req, res, next) => {
  urlModel.find({}, function (err, urls) {
    if (err) {
      res.status(500).json({ error: err })
      return next(err)
    }

    if (!urls) {
      res.status(404).json({ error: `unable to find /all urls` })
      return next()
    }

    let arr = []

    urls.forEach(function (element) {
      arr.push(element)
    })

    res.status(200).json(arr)
  })
}

const generateUniqueKey = async (val) => {
  let key
  let i = 0
  let stopped = false
  while (!stopped) {
    key = to62HEX(toHashCode(val, i++))
    let shortExist = await shortKeyExist(key)
    if (!shortExist) {
      stopped = true
    }
  }
  return key
}

const shortKeyExist = (key) => {
  return urlModel.exists({ shortKey: key })
}

const longUrlExist = (val) => {
  return urlModel.findOne({ longUrl: val })
}

module.exports = { short2Long, long2Short, deleteRecord, displayAllRecords }
