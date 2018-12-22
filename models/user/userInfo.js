'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userInfoSchema = new Schema(
  {
    id: { type: Number, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    city: String,
    registe_time: String,
    phone: Number,
    email: String,
    avatar: { type: String, default: 'default.jpg' },
    is_active: { type: Number, default: 1 }
  },
  {
    versionKey: false
  }
)

userInfoSchema.index({ id: 1 })

const UserInfo = mongoose.model('UserInfo', userInfoSchema)

export default UserInfo
