'use strict'

import mongoose from 'mongoose'
import activityData from '../../initData/activity'

const activitySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    keyword: { type: String, required: true },
    description: { type: String, required: true }
  },
  {
    versionKey: false
  }
)

const Activity = mongoose.model('Activity', activitySchema)

Activity.findOne((err, data) => {
  if (err) throw err
  if (!data) {
    activityData.forEach(item => {
      Activity.create(item)
    })
  }
})

export { activitySchema }
export default Activity
