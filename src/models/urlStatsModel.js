const mongoose = require('mongoose')
const { toISOString } = require('../lib/timeUtils.js')

const visitSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true
    },
    userAgent: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {
      currentTime: toISOString
    },
    versionKey: false
  }
)

let counterSchema = new mongoose.Schema(
  {
    shortKey: {
      type: String,
      unique: false
    },
    clicks: {
      type: Number,
      default: 0
    },
    visits: [visitSchema]
  },
  {
    timestamps: {
      currentTime: toISOString
    },
    versionKey: false
  }
)

module.exports = mongoose.model('Counter', counterSchema, 'counter')
