'use strict'

import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema(
  {
    keyword: { type: String, required: true },
    description: { type: String, required: true }
  },
  {
    versionKey: false
  }
)

const Activity = mongoose.model('Activity', activitySchema)

export { activitySchema }
export default Activity
