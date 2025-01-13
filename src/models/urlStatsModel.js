const mongoose = require('mongoose')

let counterSchema = new mongoose.Schema(
  {
    shortKey: { type: String, unique: false },
    clicks: { type: Number, default: 0 },
    ip: { type: String, unique: false },
    userAgent: { type: String, unique: false }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

module.exports = mongoose.model('Counter', counterSchema, 'counter')
