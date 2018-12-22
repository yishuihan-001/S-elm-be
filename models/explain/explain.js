'use strict'

import mongoose from 'mongoose'
import explainData from '../../initData/explain'

const explainSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }
  },
  {
    versionKey: false
  }
)

const Explain = mongoose.model('Explain', explainSchema)

let num = 1
Explain.findOne((err, data) => {
  if (err) throw err
  if (!data) {
    explainData.forEach(item => {
      item.id = num++
      Explain.create(item)
    })
  }
})

export default Explain
