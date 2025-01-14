# Url Shortener

[![API](https://img.shields.io/badge/API-deployed-green)](https://shorturl.ronsong.live/all)
[![Node.js CI](https://github.com/ronniesong0809/url-shortener/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/ronniesong0809/url-shortener/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/ronniesong0809/url-shortener/badge.svg?branch=master)](https://coveralls.io/github/ronniesong0809/url-shortener?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/ronniesong0809/url-shortener/blob/master/LICENSE)

Copyright (c) 2022 Ronnie Song

An internal service for shortening URLs that keep track of quickly referenced internal tools, wiki pages, and external resources

- Frontend: [Live demo](https://url.ronsong.live/), [repository](https://github.com/ronniesong0809/url-shortener-react)

- Backend: [Live demo](https://shorturl.ronsong.live/all), [repository](https://github.com/ronniesong0809/url-shortener)

## Requirements and Features

- Design RESTful API with analytics of usage

- Short links are randomly generated, no duplicate URLs are allowed to be created

- Short links can expire at a future time, or can live forever (TTL)

- Short links can be deleted, if a short link is created that was once deleted, it will have no "knowledge" of its previous version

## Tech Stack and Tools

Node, Express, MongoDB, Mongoose, express-oas-generator, jest, supertest, GitHub Actions, Coveralls, and Docker

- Install MongoDb by follow the [mongodb instruction](https://docs.mongodb.com/manual/installation/)

- Install Docker by follow the [docker instruction](https://docs.docker.com/get-docker/)

## Frontend Repository

To check the React frontend repository, go to [github.com/ronniesong0809/url-shortener-react](https://github.com/ronniesong0809/url-shortener-react)

## API Documentation

#### URL Endpoint:

`(POST) https://shorturl.ronsong.live/shorten`

##### Body:

- url: required
- expiration: optional

##### Response:

```json
{
  "url": "http://shorturl.ronsong.live/2h2mYC"
}
```

---

| Method | Endpoint                            | Params                                        |
| ------ | ----------------------------------- | --------------------------------------------- |
| POST   | `shorturl.ronsong.live/shorten`     | Body: `url(required)`, `expiration(optional)` |
| GET    | `shorturl.ronsong.live/{key}`       | Path: `key(required)`                         |
| GET    | `shorturl.ronsong.live/{key}/stats` | Path: `key(required)`                         |
| DELETE | `shorturl.ronsong.live/{key}`       | Path: `key(required)`                         |
| GET    | `shorturl.ronsong.live/all`         | `none`                                        |
| GET    | `shorturl.ronsong.live/all/stats`   | `none`                                        |

---

To check the API documentation which is automatically generated using express-oas-generator, go to [shorturl.ronsong.live/api/docs](https://shorturl.ronsong.live/api/docs/v3)

## Setup

### Local Setup

1. Fork/clone this repo, then download and install packages/dependencies

```
$ git clone git@github.com:ronniesong0809/url-shortener.git
$ cd url-shortener
$ npm install
```

2. Install MongoDB follow the [mongodb instruction](https://docs.mongodb.com/manual/installation/) if needed

3. Copy the `.env.example` to `.env`, and replace any entries in .env with your own values

4. Start the server by running `npm start`. or `npm dev` if you want the server to automatically restart on code changes during development

5. The server can be accessed at `localhost:5000` using curl/wget, postman, or a similar API testing tool

### Docker Setup

1. Fork/clone this repo, then download

```
$ git clone git@github.com:ronniesong0809/url-shortener.git
$ cd url-shortener
```

2. Install the new Docker Desktop follow the [docker instruction](https://docs.docker.com/get-docker/) if needed

3. Copy the `.env.dev.example` to `.env.dev`, and replace any entries in .env with your own values

4. Start the server by running `docker-compose up`

## Run Tests

```
$ npm test
```

## License

This source code is licensed under the "MIT License". Please see the [`LICENSE`](https://github.com/ronniesong0809/url-shortener/blob/master/LICENSE) file in the root directory of this source tree for license terms.
