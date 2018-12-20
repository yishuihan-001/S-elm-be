'use strict'

import mongoose from 'mongoose'
import remarkData from '../../initData/remark'

const remarkSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  label: { type: String, required: true }
},
{
  versionKey: false
}
)

remarkSchema.statics.getData = function () {
  return remarkData
}

const Remark = mongoose.model('Remark', remarkSchema)

Remark.findOne((err, data) => {
  if (err) throw err
  if (!data) {
    remarkData.forEach(list => {
      list.forEach(item => {
        Remark.create(item)
      })
    })
  }
})

export default Remark
