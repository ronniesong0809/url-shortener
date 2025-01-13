const validateUrl = (req, res, next) => {
  const { url } = req.body
  
  try {
    new URL(url)
    next()
  } catch (err) {
    res.status(400).json({ error: 'Invalid URL format' })
  }
}

const validateShortUrl = (req, res, next) => {
  const { url } = req.params
  if (!url || url.length < 1) {
    return res.status(400).json({ error: 'Short URL is required' })
  }
  next()
}

module.exports = {
  validateUrl,
  validateShortUrl
} 