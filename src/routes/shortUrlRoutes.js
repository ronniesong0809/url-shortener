const express = require('express')
const router = express.Router()
const shortUrlController = require('../controllers/shortUrlController')
const urlStatsController = require('../controllers/urlStatsController')
const { validateUrl, validateShortUrl } = require('../middleware/urlValidator')

router.get('/all', shortUrlController.displayAllRecords)
router.get('/all/stats', urlStatsController.getAllUrlsStats)
router.get('/:url', validateShortUrl, shortUrlController.short2Long)
router.get('/:url/stats', validateShortUrl, urlStatsController.getUrlStats)
router.post('/shorten', validateUrl, shortUrlController.long2Short)
router.put('/:url', validateShortUrl, shortUrlController.extendExpiration)
router.delete('/:url', validateShortUrl, shortUrlController.deleteRecord)

module.exports = router