const mongoose = require('mongoose')

let urlSchema = new mongoose.Schema({
  shortUrl: { type: String, unique: true },
  longUrl: { type: String, unique: false },
  timestamp: Date
})

module.exports = mongoose.model('URL', urlSchema, 'url')
