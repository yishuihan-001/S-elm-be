'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    id: { type: Number, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
  },
  {
    versionKey: false
  }
)

const User = mongoose.model('User', userSchema)

export default User
