const express = require('express')
const app = express()
const expressOasGenerator = require('express-oas-generator')
const bodyParser = require('body-parser')
const cors = require('cors')
const handler = require('./handler')
const dotenv = require('dotenv')
dotenv.config()
require('./utils/database')

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
expressOasGenerator.init(app, {})

// endpoints
app.get('/:url', handler.short2Long)
app.post('/shorten', handler.long2Short)
app.delete('/:url', handler.deleteRecord)

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`)
})
