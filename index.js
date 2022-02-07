const express = require('express')
const app = express()
const expressOasGenerator = require('express-oas-generator')
const { SPEC_OUTPUT_FILE_BEHAVIOR } = expressOasGenerator
const bodyParser = require('body-parser')
const cors = require('cors')
const handler = require('./handler')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
require('./utils/database')

const host = process.env.HOST || localhost
const port = process.env.PORT || 5000

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
app.get('/all', handler.displayAllRecords)
app.get('/:url', handler.short2Long)
app.post('/shorten', handler.long2Short)
app.delete('/:url', handler.deleteRecord)
expressOasGenerator.handleRequests()

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`)
})

module.exports = app
