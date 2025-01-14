const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const getCurrentTime = () => dayjs.utc()

const getExpirationDate = (updatedAt, expirationDays) => {
  return dayjs.utc(updatedAt).add(expirationDays, 'day')
}

const isExpired = (updatedAt, expirationDays) => {
  const expirationDate = getExpirationDate(updatedAt, expirationDays)
  return getCurrentTime().isAfter(expirationDate)
}

const toISOString = () => new Date().toISOString()

module.exports = {
  getCurrentTime,
  getExpirationDate,
  isExpired,
  toISOString
}
