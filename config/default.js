'use strict'

module.exports = {
  host: 'http://127.0.0.1',
  port: 9000,
  session: {
    key: 's-elm-be',
    secret: 's-elm-be',
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 3600000
    }
  },
  mongodb: 'mongodb://localhost:27017/s-elm-be'
}
