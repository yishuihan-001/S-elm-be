'use strict'

import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    account_id: { type: Number, required: true },
    address_id: { type: Number, required: true },
    restaurant_id: { type: Number, required: true },
    hongbao: { type: Number, default: 0 },
    pay_type: { type: Number, default: 0 },
    remarks: [Number],
    self_remarks: String,
    need_invoice: { type: Boolean, required: true },
    invoice: { type: String, default: '自定义发票' },
    status: { type: Number, required: true },

    create_time: { type: Number, required: true },
    due_time: { type: Number, required: true },
    restaurant_name: String,
    restaurant_image_url: String,
    total_price: { type: Number, required: true },

    deliver_fee: Number,
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
    delivery_mode: []
  },
  {
    versionKey: false
  }
)

const Order = mongoose.model('Order', orderSchema)

export default Order
