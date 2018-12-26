'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const imageSchema = new Schema(
  {
    id: { type: Number, required: true },
    user_id: Number,
    admin_id: Number,
    name: { type: String, required: true }
  },
  {
    versionKey: false
  }
)

const Image = mongoose.model('Image', imageSchema)

export default Image
