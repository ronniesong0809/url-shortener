const ShortUrl = require('../models/shortUrlModel')
const { toHashCode, to62HEX } = require('../lib/hashUtils')

class ShortUrlService {
  async getAllUrls() {
    return await ShortUrl.find({})
  }

  async getUrlByShortUrl(shortUrl) {
    return await ShortUrl.findOne({ shortUrl })
  }

  async createShortUrl(longUrl, customExpiration) {
    const hash = toHashCode(longUrl, Date.now())
    const shortUrl = to62HEX(hash)
    
    const url = new ShortUrl({
      longUrl,
      shortUrl,
      ...(customExpiration && { expiresAt: customExpiration })
    })
    
    return await url.save()
  }

  async extendUrlExpiration(shortUrl, newExpiration) {
    return await ShortUrl.findOneAndUpdate(
      { shortUrl },
      { expiresAt: newExpiration },
      { new: true }
    )
  }

  async deleteUrl(shortUrl) {
    return await ShortUrl.findOneAndDelete({ shortUrl })
  }
}

module.exports = new ShortUrlService()