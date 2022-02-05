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
  let key = to62HEX(toHashCode(val, 0))

  let i = 1,
    shortExist,
    stopped = false
  while (!stopped) {
    key = to62HEX(toHashCode(val, i++))
    shortExist = await shortUrlExist(key)
    if (!shortExist) {
      stopped = true
    }
  }

  let url = new urlModel({ shortUrl: key, longUrl: val })
  url.save(function(err) {
    if (err) {
      res.status(500).json({ error: err })
      return
    }
    res.status(200).json({ url: `${process.env.BASE_URL}/${key}` })
  })
}

const shortUrlExist = (key) => {
  return urlModel.exists({ shortUrl: key })
}

module.exports = { short2Long, long2Short }
