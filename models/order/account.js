'use strict'

import mongoose from 'mongoose'

const accountSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    restaurant_id: { type: Number, required: true },
    restaurant_info: {},
    deliver_fee: Number,
    total_price: Number,
    extra: {
      name: { type: String, default: '餐盒' },
      price: { type: Number, default: 0 },
      quantity: { type: Number, default: 0 }
    },
    manifest: [{
      food_id: { type: Number, required: true },
      item_id: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      packing_fee: { type: Number, default: 0 },
      label: String
    }],
    status: { type: Number, required: true }
  },
  {
    versionKey: false
  }
)

const Account = mongoose.model('Account', accountSchema)

export default Account
