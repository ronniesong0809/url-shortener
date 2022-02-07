# Url Shortener

Copyright (c) 2022 Ronnie Song

An internal service for shortening URLs that keep track of quickly referenced internal tools, wiki pages, and external resources

## Requirements and Features

- A well defined API for URLs created with analytics of usage

- URLs are randomly generated

- No duplicate URLs are allowed to be created

- Short links can't be easily enumerated

- Short links can expire at a future time, or can live forever (TTL)

- Short links can be deleted, if a short link is created that was once deleted, it will have no "knowledge" of its previous version

## Tech Stack and Tools

Node, Express, MongoDB, Mongoose, express-oas-generator, jest, and supertest

Install MongoDb by follow the [mongodb instruction](https://docs.mongodb.com/manual/installation/)

## API Documentation

To check the API documentation which is automatically generated using express-oas-generator, go to http://localhost:5000/api/docs

## Setup

1. Fork or clone this repo, then download and install packages/dependencies

```
$ git clone git@github.com:ronniesong0809/url-shortener.git
$ cd url-shortener
$ npm install
```

2. Copy the `.env.example` to `.env`, and replace any entries in .env with your own values

3. Start the server by running `npm start`. or `npm dev` if you want the server to automatically restart on code changes during development

4. The server can be accessed at `localhost:5000` using curl/wget, postman, or a similar API testing tool

## License
This program is licensed under the "MIT License". Please see the file LICENSE in the source distribution of this software for license terms.