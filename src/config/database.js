const mongoose = require('mongoose')

const server = process.env.MONGODB_URL || 'mongodb://localhost:27017'
const database = process.env.MONGODB_DATABASE || 'url-shortener'

class DataBase {
  constructor() {
    this._connect()
  }

  _connect() {
    mongoose
      .connect(`${server}/${database}?retryWrites=true&w=majority`)
      .then(() => {
        console.log(`Database ${database} connection successful!`)
      })
      .catch((error) => {
        console.error(`Database ${database} connection error: ${error}`)
      })
  }
}

module.exports = new DataBase()
