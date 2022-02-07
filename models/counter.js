const mongoose = require('mongoose')

let counterSchema = new mongoose.Schema(
  {
    _id: { type: String, unique: false },
    seq: { type: Number, default: 0 },
    lastUpdate: Date
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('Counter', counterSchema, 'counter')
