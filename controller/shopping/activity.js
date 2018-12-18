'use strict'

import ActivityModel from '../../models/shopping/activity'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Activity extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.getAllActivity = this.getAllActivity.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 获取所有配送方式
  async getAllActivity (req, res, next) {
    try {
      let activityList = await ActivityModel.find({}, '-_id')
      res.send(Res.Success(activityList))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取配送方式失败'))
    }
  }
}
export default new Activity()
