'use strict'

import mongoose from 'mongoose'
import deliveryData from '../../initData/delivery'

const deliverySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    color: { type: String, required: true },
    is_solid: { type: Boolean, required: true },
    text: { type: String, required: true }
  },
  {
    versionKey: false
  }
)

const Delivery = mongoose.model('Delivery', deliverySchema)

Delivery.findOne((err, data) => {
  if (err) throw err
  if (!data) {
    deliveryData.forEach(item => {
      Delivery.create(item)
    })
  }
})

export { deliverySchema }
export default Delivery
