const Url = require('../models/url')
const { toHashCode, to62HEX } = require('../lib/hashUtils')

class UrlService {
  async getAllUrls() {
    return await Url.find({})
  }

  async getUrlByShortUrl(shortUrl) {
    return await Url.findOne({ shortUrl })
  }

  async createShortUrl(longUrl, customExpiration) {
    const hash = toHashCode(longUrl, Date.now())
    const shortUrl = to62HEX(hash)
    
    const url = new Url({
      longUrl,
      shortUrl,
      ...(customExpiration && { expiresAt: customExpiration })
    })
    
    return await url.save()
  }

  async extendUrlExpiration(shortUrl, newExpiration) {
    return await Url.findOneAndUpdate(
      { shortUrl },
      { expiresAt: newExpiration },
      { new: true }
    )
  }

  async deleteUrl(shortUrl) {
    return await Url.findOneAndDelete({ shortUrl })
  }
}

module.exports = new UrlService()