'use strict'

import mongoose from 'mongoose'
import { labelSchema } from './label'
import { deliverySchema } from './delivery'
import { activitySchema } from './activity'

const shopSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    category: { type: Number, required: true },
    image_path: { type: String, required: true },
    float_delivery_fee: { type: Number, required: true },
    float_minimum_order_amount: { type: Number, required: true },
    description: { type: String, default: '商铺描述' },
    promotion_info: { type: String, default: '商铺标语' },
    // is_premium: { type: Boolean, default: false },
    // is_new: { type: Boolean, default: false },
    // is_bao: { type: Boolean, default: false },
    // is_zhun: { type: Boolean, default: false },
    // is_piao: { type: Boolean, default: false },
    startTime: String,
    endTime: String,
    business_license_image: String,
    catering_service_license_image: String,
    rating: { type: Number, default: 0 },
    rating_count: { type: Number, default: 0 },
    recent_order_num: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    labels: [labelSchema],
    delivery_mode: [deliverySchema],
    activities: [activitySchema]
  },
  {
    versionKey: false
  }
)

const Shop = mongoose.model('Shop', shopSchema)

export default Shop
