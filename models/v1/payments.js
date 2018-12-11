'use strict'

import mongoose from 'mongoose'
import paymentsData from '../../InitData/payments'

const Schema = mongoose.Schema

const paymentsSchema = new Schema({
  description: String,
  disabled_reason: String,
  id: Number,
  is_online_payment: Boolean,
  name: String,
  promotion: [],
  select_state: Number
})

const Payments = mongoose.model('Payments', paymentsSchema)

Payments.findOne((err, data) => {
  if (err) throw err
  if (!data) {
    paymentsData.forEach(item => {
      Payments.create(item)
    })
  }
})

export default Payments
