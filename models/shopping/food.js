'use strict'

import mongoose from 'mongoose'

const foodSchema = new mongoose.Schema(
  {
    data: {}
  },
  {
    versionKey: false
  }
)

const Food = mongoose.model('Food', foodSchema)

export default Food
