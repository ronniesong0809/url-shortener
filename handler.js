const map = new Map()

const short2Long = (req, res) => {
  let key = req.path.substring(1)
  let val = map.get(key)

  if (val) {
    res.redirect(302, `https://${val}`)
  } else {
    res.status(404).json({ error: 'unable to find URL to redirect to' })
  }
}

const long2Short = (req, res) => {
  if (!req.body || !req.body.key || !req.body.url) {
    res.status(422).json({ error: 'missing required parameter'})
  }
  
  let key = req.body.key
  let val = req.body.url

  if (map.has(key)) {
    res.json({ url: `${process.env.BASE_URL}/${key}` })
  }
  
  map.set(key, val)
  res.json({ url: `${process.env.BASE_URL}/${key}` })
}

module.exports = { short2Long, long2Short }
