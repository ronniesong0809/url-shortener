const express = require('express')
const router = express.Router()
const urlController = require('../controllers/urlController')
const counterController = require('../controllers/counterController')

router.get('/all', urlController.displayAllRecords)
router.get('/all/stats', counterController.getAllUrlsStats)
router.get('/:url', urlController.short2Long)
router.get('/:url/stats', counterController.getUrlStats)
router.post('/shorten', urlController.long2Short)
router.put('/:url', urlController.extendExpiration)
router.delete('/:url', urlController.deleteRecord)

module.exports = router