const express = require('express')
const app = express()
const expressOasGenerator = require('express-oas-generator')
const bodyParser = require('body-parser')
const handler = require('./handler')
const dotenv = require('dotenv')
dotenv.config()

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
expressOasGenerator.init(app, {})

// endpoints
app.get('/:url', handler.short2Long)
app.post('/shorten', handler.long2Short)

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`)
})
