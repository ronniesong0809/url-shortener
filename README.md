# Url Shortener
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/ronniesong0809/url-shortener/blob/master/LICENSE)

Copyright (c) 2022 Ronnie Song

An internal service for shortening URLs that keep track of quickly referenced internal tools, wiki pages, and external resources

## Requirements and Features

- Design RESTful API with analytics of usage

- Short links are randomly generated, no duplicate URLs are allowed to be created

- Short links can expire at a future time, or can live forever (TTL)

- Short links can be deleted, if a short link is created that was once deleted, it will have no "knowledge" of its previous version

## Tech Stack and Tools

Node, Express, MongoDB, Mongoose, express-oas-generator, jest, and supertest, Docker

Install MongoDb by follow the [mongodb instruction](https://docs.mongodb.com/manual/installation/)

Install Docker by follow the [docker instruction](https://docs.docker.com/get-docker/)

## API Documentation

To check the API documentation which is automatically generated using express-oas-generator, go to http://localhost:5000/api/docs

## Setup

1. Fork/clone this repo, then download and install packages/dependencies

```
$ git clone git@github.com:ronniesong0809/url-shortener.git
$ cd url-shortener
$ npm install
```

2. Copy the `.env.example` to `.env`, and replace any entries in .env with your own values

3. Start the server by running `npm start`. or `npm dev` if you want the server to automatically restart on code changes during development

4. The server can be accessed at `localhost:5000` using curl/wget, postman, or a similar API testing tool

## Build and Deploy

```
$ docker build . -t <your username>/url-shortener
$ docker run -p 5000:5000 -d ronniesong0809/url-shortener
```

## License
This program is licensed under the "MIT License". Please see the file LICENSE in the source distribution of this software for license terms.