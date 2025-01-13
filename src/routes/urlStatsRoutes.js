const express = require('express')
const router = express.Router()

const urlStatsController = require('../controllers/urlStatsController')
const { validateShortUrl } = require('../middleware/urlValidator')

router.get('/all/stats', urlStatsController.getAllUrlsStats)
router.get('/:url/stats', validateShortUrl, urlStatsController.getUrlStats)

module.exports = router