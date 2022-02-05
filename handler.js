const { toHashCode, to62HEX } = require('./utils/util')
const urlModel = require('./models/url')

const short2Long = (req, res) => {
  let key = req.path.substring(1)

  try {
    urlModel.findOne({ $match: { shortUrl: key } }).then(function (response) {
      let val = response.longUrl
      if (val) {
        res.redirect(302, `https://${val}`)
      } else {
        res.status(404).json({ error: 'unable to find URL to redirect to' })
      }
    })
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

const long2Short = async (req, res) => {
  if (!req.body || !req.body.url) {
    res.status(422).json({ error: 'missing required parameter' })
    return
  }

  let val = req.body.url
  let key = await generateUniqueKey(val)

  let longExist = await longUrlExist(val)
  if (longExist) {
    res.status(200).json({
      url: `${process.env.BASE_URL}/${key}`,
      message: 'url already exists'
    })
    return
  }

  urlModel.create(
    { shortUrl: key, longUrl: val, timestamp: new Date() },
    function (err) {
      if (err) {
        res.status(500).json({ error: err })
        return
      }
      res.status(200).json({ url: `${process.env.BASE_URL}/${key}` })
    }
  )
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
  return urlModel.exists({ longUrl: val })
}

module.exports = { short2Long, long2Short }
