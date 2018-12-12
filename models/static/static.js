'use strict'

import mongoose from 'mongoose'

const staticSchema = new mongoose.Schema(
  {
    id: Number,
    url: String,
    host: String,
    date: String
  },
  {
    versionKey: false
  }
)

const Static = mongoose.model('Static', staticSchema)

export default Static
