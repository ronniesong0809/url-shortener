const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({ foo: 'bar' })
})

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`)
})
