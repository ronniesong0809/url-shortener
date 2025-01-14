const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema(
  {
    shortKey: {
      type: String,
      required: true,
      unique: true
    },
    shortUrl: {
      type: String,
      required: true
    },
    longUrl: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    hostname: {
      type: String,
      required: true
    },
    expiration: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = mongoose.model('Url', urlSchema, 'url')
