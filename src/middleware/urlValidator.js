const axios = require('axios')

const validateUrl = async (req, res, next) => {
  const { url } = req.body
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  // Check URL length
  if (url.length > 2048) {
    return res.status(400).json({ error: 'URL is too long. Maximum length is 2048 characters' })
  }
  
  try {
    const parsedUrl = new URL(url)
    
    // Validate protocol
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: 'URL must use HTTP or HTTPS protocol' })
    }

    // Validate hostname length
    if (parsedUrl.hostname.length > 253) {
      return res.status(400).json({ error: 'Domain name is too long' })
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\.(exe|dll|bat|cmd|sh|cgi|pl|py|php|asp|jsp)$/i,  // Executable files
      /(javascript|data):/i,  // JavaScript or data URLs
      /(<|>|'|"|`|\{|\}|\[|\])/  // HTML/Script injection characters
    ]

    if (suspiciousPatterns.some(pattern => pattern.test(url))) {
      return res.status(400).json({ error: 'URL contains suspicious patterns' })
    }

    // Check if URL is accessible and store response for metadata
    try {
      const response = await axios.get(url, {
        timeout: 5000,
        maxRedirects: 5,
        validateStatus: (status) => status < 500  // Accept any status below 500
      })
      
      // Store the response for metadata extraction
      res.locals.urlResponse = response
      
      // If it's a 4XX status, we'll still proceed but add a warning
      if (response.status >= 400) {
        res.locals.urlWarning = `Warning: URL returned status ${response.status}`
      }
      
      next()
    } catch (error) {
      if (error.response && error.response.status >= 500) {
        return res.status(400).json({ error: `URL server error: ${error.response.status}` })
      } else if (error.code === 'ECONNABORTED') {
        return res.status(400).json({ error: 'URL request timed out' })
      } else {
        return res.status(400).json({ error: 'URL is not accessible' })
      }
    }
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