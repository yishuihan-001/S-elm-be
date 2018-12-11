'use strict'

const express = require('express')

const router = express.Router()

router.get('/', function (req, res, next) {
  return res.send({
    status: 1,
    message: 'hello, world !'
  })
})

module.exports = router
