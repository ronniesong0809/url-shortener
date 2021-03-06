const express = require('express')
const app = express()
const expressOasGenerator = require('express-oas-generator')
const { SPEC_OUTPUT_FILE_BEHAVIOR } = expressOasGenerator
const bodyParser = require('body-parser')
const cors = require('cors')
const urlController = require('./controller/urlController')
const counterController = require('./controller/counterController')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
require('./utils/database')

// middleware
expressOasGenerator.handleResponses(app, {
  mongooseModels: mongoose.modelNames(),
  specOutputPath: './api_docs.json',
  specOutputFileBehavior: SPEC_OUTPUT_FILE_BEHAVIOR.PRESERVE,
  alwaysServeDocs: true,
  swaggerUiServePath: 'api/docs'
})
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
expressOasGenerator.handleRequests()

module.exports = app
