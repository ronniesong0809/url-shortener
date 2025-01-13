const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const urlRoutes = require('./routes/urlRoutes')

dotenv.config()
require('./config/database')

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// routes
app.use('/', urlRoutes)

module.exports = app
