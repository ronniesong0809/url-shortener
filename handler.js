const { toHashCode, to62HEX } = require('./utils/util')
const urlModel = require('./models/url')

const short2Long = (req, res, next) => {
  let key = req.path.substring(1)

  urlModel.findOne({ shortUrl: key }, function (err, url) {
    if (err) {
      res.status(500).json({ error: err })
      return next(err)
    }
    if (!url) {
      res.status(404).json({ error: 'unable to find URL to redirect to' })
      return next()
    }
    res.redirect(302, `${url.longUrl}`)
  })
}

const long2Short = async (req, res, next) => {
  if (!req.body || !req.body.url) {
    res.status(422).json({ error: 'missing required parameter' })
    return next()
  }

  let val = req.body.url
  let key = await generateUniqueKey(val)

  let longExist = await longUrlExist(val)
  if (longExist) {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:5000'
    res.status(200).json({
      url: `${BASE_URL}/${longExist.shortUrl}`,
      message: 'url already exists'
    })
    return next()
  }

  urlModel.create(
    {
      shortUrl: key,
      longUrl: val,
      timestamp: new Date()
    },
    function (err) {
      if (err) {
        console.log(err)
        res.status(500).json({ error: err })
        return next(err)
      }
      res.status(201).json({ url: `${process.env.BASE_URL}/${key}` })
    }
  )
}

const deleteRecord = async (req, res, next) => {
  let key = req.path.substring(1)

  urlModel.deleteOne({ shortUrl: key }).then((result) => {
    if (result.deletedCount == 0) {
      res.status(404).json({ error: `${key} not found` })
      return next()
    }
    res.status(200).json({ message: `${key} deleted` })
  })
}

const displayAllRecords = (req, res) => {
  urlModel.find({}, function (err, urls) {
    let map = []

    urls.forEach(function (url) {
      map.push(url)
    })

    res.send(map)
  })
}

const generateUniqueKey = async (val) => {
  let key
  let i = 0
  let stopped = false
  while (!stopped) {
    key = to62HEX(toHashCode(val, i++))
    let shortExist = await shortUrlExist(key)
    if (!shortExist) {
      stopped = true
    }
  }
  return key
}

const shortUrlExist = (key) => {
  return urlModel.exists({ shortUrl: key })
}

const longUrlExist = (val) => {
  return urlModel.findOne({ longUrl: val })
}

module.exports = { short2Long, long2Short, deleteRecord, displayAllRecords }
