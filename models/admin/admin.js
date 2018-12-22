'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const adminSchema = new Schema(
  {
    id: { type: Number, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    create_time: { type: String, required: true },
    type: { type: String, enum: ['o', 's'], default: 'o' },
    avatar: { type: String, default: 'default.jpg' },
    city: { type: String, required: true }
  },
  {
    versionKey: false
  }
)

adminSchema.index({ id: 1 })

const Admin = mongoose.model('Admin', adminSchema)

export default Admin
