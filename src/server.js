const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const shortUrlRoutes = require('./routes/shortUrlRoutes')
const urlStatsRoutes = require('./routes/urlStatsRoutes')
const errorHandler = require('./middleware/errorHandler')

dotenv.config()
require('./config/database')

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// routes
app.use('/', shortUrlRoutes)
app.use('/', urlStatsRoutes)

// error handling
app.use(errorHandler)

module.exports = app
