'use strict'

import ShopModel from '../../models/shopping/shop'
import RateModel from '../../models/shopping/rate'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Rate extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.getRatings = this.getRatings.bind(this)
    this.getScores = this.getScores.bind(this)
    this.getTags = this.getTags.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 统一获取信息
  async getRateUnify (req, res, next, type) {
    let shopId = req.params.id
    if (Ju.isEmpty(shopId)) {
      return res.send(Res.Fail('商铺id不能为空'))
    }

    let targetShop = await ShopModel.findOne({ id: shopId })
    if (!targetShop) {
      return res.send(Res.Fail('该商铺不存在'))
    }

    try {
      let resObj = await RateModel.getData(+shopId, type)
      res.send(Res.Success(resObj))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取评价信息失败'))
    }
  }

  // 获取评价信息
  async getRatings (req, res, next) {
    await this.getRateUnify(req, res, next, 'ratings')
  }

  // 获取评价分数
  async getScores (req, res, next) {
    await this.getRateUnify(req, res, next, 'scores')
  }

  // 获取评价分类
  async getTags (req, res, next) {
    await this.getRateUnify(req, res, next, 'tags')
  }
}

export default new Rate()
