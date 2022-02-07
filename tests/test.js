const request = require('supertest')
const app = require('../index')

describe('Testing the post /shorten API with request body', () => {
  it('POST /shorten', async () => {
    const response = await request(app)
      .post('/shorten')
      .send({ url: 'https://github.com/ronniesong0809/url-shortener' })
    expect(response.status).toBe(201)
  })
})

describe('Testing the get /{url} API with the short url', () => {
  it('GET /{url}', async () => {
    const response = await request(app).get('/2h2mYC')
    expect(response.status).toBe(302)
  })
})

describe('Testing the delete /{url} API with the short url', () => {
  it('DELETE /{url}', async () => {
    const response = await request(app).delete('/2h2mYC')
    expect(response.status).toBe(200)
  })
})


describe('Testing the get /all API to display all urls', () => {
  it('POST /all', async () => {
    const response = await request(app).get('/all')
    expect(response.status).toBe(200)
  })
})
