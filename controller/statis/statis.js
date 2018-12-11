'use strict'

import StatisModel from '../../models/statis/statis'
import UserInfoModel from '../../models/v2/userInfo'
import OrderModel from '../../models/bos/order'
import dtime from 'time-stamp'
import AdminModel from '../../models/admin/admin'
import Res from '../../lib/res'

class Statis {
  async apiCount (req, res, next) {
    const date = req.params.date
    if (!date) {
      console.log('参数错误')
      return res.send(Res.Fail('参数错误'))
    }
    try {
      const count = await StatisModel.find({ date }).count()
      res.send(Res.Success(count))
    } catch (err) {
      console.log('获取当天API请求次数失败')
      res.send(Res.Fail(err.message || '获取当天API请求次数失败'))
    }
  }
  async apiAllCount (req, res, next) {
    try {
      const count = await StatisModel.count()
      res.send(Res.Success(count))
    } catch (err) {
      console.log('获取所有API请求次数失败')
      res.send(Res.Fail(err.message || '获取所有API请求次数失败'))
    }
  }
  async allApiRecord (req, res, next) {
    try {
      const allRecord = await StatisModel.find({}, '-_id -__v')
      res.send(Res.Success(allRecord))
    } catch (err) {
      console.log('获取所有API请求信息失败')
      res.send(Res.Fail(err.message || '获取所有API请求信息失败'))
    }
  }
  async userCount (req, res, next) {
    const date = req.params.date
    if (!date) {
      console.log('参数错误')
      res.send(Res.Fail('参数错误'))
      return
    }
    try {
      const count = await UserInfoModel.find({ registe_time: eval('/^' + date + '/gi') }).count()
      res.send(Res.Success(count))
    } catch (err) {
      console.log('获取当天注册人数失败')
      res.send(Res.Fail(err.message || '获取当天注册人数失败'))
    }
  }
  async adminCount (req, res, next) {
    const date = req.params.date
    if (!date) {
      console.log('参数错误')
      return res.send(Res.Fail('参数错误'))
    }
    try {
      const count = await AdminModel.find({ create_time: eval('/^' + date + '/gi') }).count()
      res.send(Res.Success(count))
    } catch (err) {
      console.log('获取当天注册管理员人数失败')
      res.send(Res.Fail(err.message || '获取当天注册管理员人数失败'))
    }
  }
  async orderCount (req, res, next) {
    const date = req.params.date
    if (!date) {
      console.log('参数错误')
      return res.send(Res.Fail('参数错误'))
    }
    try {
      const count = await OrderModel.find({ formatted_created_at: eval('/^' + date + '/gi') }).count()
      res.send(Res.Success(count))
    } catch (err) {
      console.log('获取当天订单数量失败')
      res.send(Res.Fail(err.message || '获取当天订单数量失败'))
    }
  }
}

export default new Statis()
