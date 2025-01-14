const mongoose = require('mongoose')
const { toISOString } = require('../lib/timeUtils.js')

const browserSchema = new mongoose.Schema({
  name: String,
  version: String,
  type: String
}, { _id: false })

const engineSchema = new mongoose.Schema({
  name: String,
  version: String
}, { _id: false })

const osSchema = new mongoose.Schema({
  name: String,
  version: String
}, { _id: false })

const deviceSchema = new mongoose.Schema({
  vendor: String,
  model: String,
  type: String
}, { _id: false })

const metadataSchema = new mongoose.Schema({
  browser: browserSchema,
  engine: engineSchema,
  os: osSchema,
  device: deviceSchema,
  cpu: String
}, { _id: false })

const visitSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true
    },
    userAgent: {
      type: String,
      required: true
    },
    acceptLanguage: {
      type: String
    },
    cookies: {
      type: Object
    },
    referer: {
      type: String
    },
    metadata: metadataSchema,
    timestamp: {
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

const counterSchema = new mongoose.Schema(
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
