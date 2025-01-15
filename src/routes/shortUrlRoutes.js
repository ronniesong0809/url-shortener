const express = require('express')
const router = express.Router()

const { validateUrl, validateShortUrl } = require('../middleware/urlValidator')
const shortUrlService = require('../services/shortUrlService')

router.get('/all', shortUrlService.displayAllRecords)
router.get('/all/metadata', shortUrlService.getAllMetadata)
router.get('/:url', validateShortUrl, shortUrlService.short2Long)
router.post('/shorten', validateUrl, shortUrlService.long2Short)
router.put('/extend', shortUrlService.extendExpiration)
router.delete('/:url', validateShortUrl, shortUrlService.deleteRecord)

module.exports = router
