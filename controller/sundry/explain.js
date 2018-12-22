'use strict'

import ExplainModel from '../../models/explain/explain'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Explain extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.getExplain = this.getExplain.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 获取服务消息
  async getExplain (req, res, next) {
    try {
      let explainList = await ExplainModel.find({}, '-_id')
      res.send(Res.Success(explainList))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取服务信息失败'))
    }
  }
}

export default new Explain()
