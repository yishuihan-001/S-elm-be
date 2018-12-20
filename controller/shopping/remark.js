'use strict'

import RemarkModel from '../../models/shopping/remark'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Remark extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.getAllRemark = this.getAllRemark.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 获取所有备注标签
  async getAllRemark (req, res, next) {
    try {
      let remarkList = RemarkModel.getData()
      res.send(Res.Success(remarkList))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取备注列表失败'))
    }
  }
}
export default new Remark()
