'use strict'

import mongoose from 'mongoose'
import { foodSchema } from './food'

const menuSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    restaurant_id: { type: Number, required: true },
    name: { type: String, required: true },
    is_selected: { type: Boolean, default: false },
    description: String,
    icon_url: { type: String, default: '' },
    foods: [foodSchema]
  },
  {
    versionKey: false
  }
)

const Menu = mongoose.model('Menu', menuSchema)

export default Menu
