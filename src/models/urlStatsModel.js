const mongoose = require('mongoose')

const visitSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

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
    timestamps: true
  }
)

module.exports = mongoose.model('Counter', counterSchema, 'counter')
