const express = require('express')
const app = express()
const expressOasGenerator = require('express-oas-generator')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
expressOasGenerator.init(app, {})

// endpoints
app.get('/', (req, res) => {
  res.json({ foo: 'bar' })
})

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`)
})
