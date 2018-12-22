'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const addressSchema = new Schema(
  {
    id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    address: { type: String, required: true },
    address_detail: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    sex: { type: String, enum: ['male', 'female', 'privary'], default: 'privary' },
    tag: { type: String, enum: ['家', '公司', '学校'], default: '家' },
    lat: Number,
    lng: Number,
    is_default: { type: Boolean, default: false }
  },
  {
    versionKey: false
  }
)

const Address = mongoose.model('Address', addressSchema)

export default Address
