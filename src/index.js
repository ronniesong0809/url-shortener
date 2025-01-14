const app = require('./server')

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 5000

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`)
})
