const map = new Map()

const short2Long = (req, res) => {
  let key = req.path.substring(1)
  let val = map.get(key)

  console.log(key, val)

  res.json({ url: val })
}

const long2Short = (req, res) => {
  let key = req.body.key
  let val = req.body.url

  map.set(key, val)
  console.log(map)

  res.json({ url: `${process.env.BASE_URL}/${key}` })
}

module.exports = { short2Long, long2Short }
