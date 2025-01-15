const express = require('express')
const router = express.Router()

const { validateShortUrl } = require('../middleware/urlValidator')
const urlStatsService = require('../services/urlStatsService')

router.get('/all/stats', urlStatsService.getAllUrlsStats)
router.get('/:url/stats', validateShortUrl, urlStatsService.getUrlStats)
router.get('/:shortKey/daily', urlStatsService.getVisitCountsByDate)

module.exports = router
