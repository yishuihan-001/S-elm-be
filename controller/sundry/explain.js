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
    this.getExplainList = this.getExplainList.bind(this)
    this.getExplainDetail = this.getExplainDetail.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 获取服务消息列表
  async getExplainList (req, res, next) {
    try {
      let explainList = await ExplainModel.find({}, '-_id')
      res.send(Res.Success(explainList))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取服务信息失败'))
    }
  }

  // 获取服务消息详情
  async getExplainDetail (req, res, next) {
    try {
      let id = req.params.id
      if (Ju.isEmpty(id)) {
        throw new Error('参数id不能为空')
      }
      let explainDetail = await ExplainModel.findOne({ id }, '-_id')
      res.send(Res.Success(explainDetail))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取服务信息详情失败'))
    }
  }
}

export default new Explain()
