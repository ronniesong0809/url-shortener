const cheerio = require('cheerio')
const axios = require('axios')

const cleanText = (text) => {
  if (!text) return ''
  return text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
}

const fetchMetadata = async (url, existingResponse = null) => {
  const hostname = new URL(url).hostname.replace('www.', '')
  try {
    let response
    if (existingResponse) {
      response = existingResponse
    } else {
      response = await axios.get(url)
    }

    const $ = cheerio.load(response.data)

    const title = cleanText(
      $('title').text() || $('meta[property="og:title"]').attr('content') || ''
    )
    const description = cleanText(
      $('meta[name="description"]').attr('content') ||
        $('meta[property="og:description"]').attr('content') ||
        ''
    )

    return {
      title,
      description,
      hostname
    }
  } catch (error) {
    console.error('Error fetching metadata:', error.message)

    return {
      title: '',
      description: '',
      hostname
    }
  }
}

module.exports = { fetchMetadata }
