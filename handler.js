const { toHashCode, to62HEX } = require('./util')
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
  if (!req.body || !req.body.url) {
    res.status(422).json({ error: 'missing required parameter' })
  }

  let val = req.body.url
  let key = to62HEX(toHashCode(val, 0))

  let i = 1
  while (map.has(key)) {
    key = to62HEX(toHashCode(val, i++))
  }

  map.set(key, val)
  console.log(map);
  res.json({ url: `${process.env.BASE_URL}/${key}` })
}

module.exports = { short2Long, long2Short }
