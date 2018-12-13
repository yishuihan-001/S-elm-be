'use strict'

import FoodModel from '../../models/shopping/food'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Food extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }
}
export default new Food()
