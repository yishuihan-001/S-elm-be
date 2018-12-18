'use strict'

import DeliveryModel from '../../models/shopping/delivery'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Delivery extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.getAllDelivery = this.getAllDelivery.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 获取所有配送方式
  async getAllDelivery (req, res, next) {
    try {
      let deliveryList = await DeliveryModel.find({}, '-_id')
      res.send(Res.Success(deliveryList))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取配送方式失败'))
    }
  }
}
export default new Delivery()
