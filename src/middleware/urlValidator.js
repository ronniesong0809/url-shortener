const axios = require('axios')

const validateUrl = async (req, res, next) => {
  const { url } = req.body
  
  if (!url) {
    return res.status(400).json({ error: 'Missing required field: url' })
  }

  if (url.length > 2048) {
    return res.status(400).json({ error: 'URL exceeds maximum length of 2048 characters' })
  }
  
  try {
    const parsedUrl = new URL(url)
    
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: 'Invalid protocol: URL must use HTTP or HTTPS' })
    }

    if (parsedUrl.hostname.length > 253) {
      return res.status(400).json({ error: 'Invalid hostname: Domain name exceeds maximum length' })
    }

    const suspiciousPatterns = [
      /\.(exe|dll|bat|cmd|sh|cgi|pl|py|php|asp|jsp)$/i,
      /(javascript|data):/i,
      /(<|>|'|"|`|\{|\}|\[|\])/
    ]

    if (suspiciousPatterns.some(pattern => pattern.test(url))) {
      return res.status(400).json({ error: 'Invalid URL: Contains suspicious patterns' })
    }

    try {
      const response = await axios.get(url, {
        timeout: 5000,
        maxRedirects: 5,
        validateStatus: (status) => status < 500
      })
      
      res.locals.urlResponse = response
      
      if (response.status >= 400) {
        res.locals.urlWarning = `Warning: Target URL returned status ${response.status}`
      }
      
      next()
    } catch (error) {
      if (error.response && error.response.status >= 500) {
        return res.status(400).json({ error: 'Target URL server error' })
      } else if (error.code === 'ECONNABORTED') {
        return res.status(400).json({ error: 'Target URL request timeout' })
      } else {
        return res.status(400).json({ error: 'Target URL is not accessible' })
      }
    }
  } catch (err) {
    return res.status(400).json({ error: 'Invalid URL format' })
  }
}

const validateShortUrl = (req, res, next) => {
  const { url } = req.params
  if (!url || url.length < 1) {
    return res.status(400).json({ error: 'Missing required field: short URL' })
  }
  next()
}

module.exports = {
  validateUrl,
  validateShortUrl
} 