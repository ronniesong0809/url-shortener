const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const urlController = require('./controller/urlController')
const counterController = require('./controller/counterController')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
require('./utils/database')

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// endpoints
app.get('/all', urlController.displayAllRecords)
app.get('/all/stats', counterController.getAllUrlsStats)
app.get('/:url', urlController.short2Long)
app.get('/:url/stats', counterController.getUrlStats)
app.post('/shorten', urlController.long2Short)
app.put('/:url', urlController.extendExpiration)
app.delete('/:url', urlController.deleteRecord)

module.exports = app
