'use strict'

import mongoose from 'mongoose'
import { activitySchema } from './activity'

const foodSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    restaurant_id: { type: Number, required: true },
    menu_id: { type: Number, required: true },
    name: { type: String, required: true },
    image_path: { type: String, required: true },
    is_multi: { type: Boolean, required: false },
    description: String,
    attributes: [{
      name: { type: String, required: true },
      color: { type: String, required: true }
    }],
    activity: [activitySchema],
    rating: { type: Number, default: 0 },
    rating_count: { type: Number, default: 0 },
    month_sales: { type: Number, default: 0 },
    single_spec: { },
    multi_spec: [{
      item_id: { type: Number, required: true },
      original_price: { type: Number, required: true },
      current_price: { type: Number, required: true },
      stock: { type: Number, required: true },
      label: { type: String, required: true }
    }]
  },
  {
    versionKey: false
  }
)

const Food = mongoose.model('Food', foodSchema)

export { foodSchema }
export default Food
