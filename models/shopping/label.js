'use strict'

import mongoose from 'mongoose'
import labelData from '../../initData/label'

const labelSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    description: { type: String, required: true },
    icon_color: { type: String, required: true },
    icon_name: { type: String, required: true },
    name: { type: String, required: true },
    ranking_weight: { type: Number, required: true }
  },
  {
    versionKey: false
  }
)

const Label = mongoose.model('Label', labelSchema)

Label.findOne((err, data) => {
  if (err) throw err
  if (!data) {
    labelData.forEach(item => {
      Label.create(item)
    })
  }
})

export { labelSchema }
export default Label
