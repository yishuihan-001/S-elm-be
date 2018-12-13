'use strict'

import CategoryModel from '../../models/shopping/category'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Category extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.getAllCategory = this.getAllCategory.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 获取所有分类
  async getAllCategory (req, res, next) {
    try {
      let categoryList = await CategoryModel.find({}, '-_id')
      res.send(Res.Success(categoryList))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取食品分类失败'))
    }
  }
}
export default new Category()
