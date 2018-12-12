'use strict'

import mongoose from 'mongoose'

const idsSchema = new mongoose.Schema(
  {
    name: String,
    value: Number
  },
  {
    versionKey: false
  }
)

const Ids = mongoose.model('Ids', idsSchema)

export default Ids
