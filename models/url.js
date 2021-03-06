const mongoose = require('mongoose')

let urlSchema = new mongoose.Schema(
  {
    shortKey: { type: String, unique: true },
    shortUrl: { type: String, unique: true },
    longUrl: { type: String, unique: false },
    expiration: {
      type: Number,
      required: false,
      min: 0,
      max: 7
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

module.exports = mongoose.model('URL', urlSchema, 'url')
