'use strict'

import LabelModel from '../../models/shopping/label'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Label extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.getAllLabel = this.getAllLabel.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 获取所有属性标签
  async getAllLabel (req, res, next) {
    try {
      let activityList = await LabelModel.find({}, '-_id')
      res.send(Res.Success(activityList))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取配送方式失败'))
    }
  }
}
export default new Label()
