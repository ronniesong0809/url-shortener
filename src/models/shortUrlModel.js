const mongoose = require('mongoose')
const { toISOString } = require('../lib/timeUtils.js')

const urlSchema = new mongoose.Schema(
  {
    shortKey: {
      type: String,
      required: true,
      unique: true
    },
    longUrl: {
      type: String,
      required: true
    },
    metadata: {
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
      }
    },
    expiration: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: {
      currentTime: toISOString
    },
    versionKey: false
  }
)

module.exports = mongoose.model('Url', urlSchema, 'url')
