'use strict'

import timestamp from 'time-stamp'
import StaticModel from '../../models/static/static'
import UserInfoModel from '../../models/user/userInfo'
import OrderModel from '../../models/order/order'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Statis extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.allApiAcount = this.allApiAcount.bind(this)
    this.dateApiAcount = this.dateApiAcount.bind(this)
    this.allUserRegisteNum = this.allUserRegisteNum.bind(this)
    this.dateUserRegisteNum = this.dateUserRegisteNum.bind(this)
    this.allOrderNum = this.allOrderNum.bind(this)
    this.dateOrderNum = this.dateOrderNum.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 获取api请求总量
  async allApiAcount (req, res, next) {
    try {
      let count = await StaticModel.count()
      res.send(Res.Success(count))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取所有api请求量失败'))
    }
  }

  // 获取某日api请求量
  async dateApiAcount (req, res, next) {
    let date = req.params.date || timestamp('YYYY-MM-DD')
    try {
      let count = await StaticModel.find({ date: eval('/^' + date + '/') }).count()
      res.send(Res.Success(count))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取该日api请求量失败'))
    }
  }

  // 获取用户注册总量
  async allUserRegisteNum (req, res, next) {
    try {
      let count = await UserInfoModel.count()
      res.send(Res.Success(count))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取用户注册总量失败'))
    }
  }

  // 获取某日用户注册量
  async dateUserRegisteNum (req, res, next) {
    let date = req.params.date || timestamp('YYYY-MM-DD')
    try {
      let count = await UserInfoModel.find({ registe_time: eval('/^' + date + '/') }).count()
      res.send(Res.Success(count))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取该日用户注册量失败'))
    }
  }

  // 获取订单总量
  async allOrderNum (req, res, next) {
    try {
      let count = await OrderModel.count()
      res.send(Res.Success(count))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取订单总量失败'))
    }
  }

  // 获取某日订单量
  async dateOrderNum (req, res, next) {
    let date = req.params.date || timestamp('YYYY-MM-DD')
    let startDate = new Date(date + ' 00:00:00').getTime()
    let endDate = new Date(date + ' 23:59:59').getTime()
    try {
      let count = await OrderModel.find({ $and: [{ 'create_time': { $gt: startDate } }, { 'create_time': { $lte: endDate } }] }).count()
      res.send(Res.Success(count))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取该日订单量失败'))
    }
  }
}

export default new Statis()
