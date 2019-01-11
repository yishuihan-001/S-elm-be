'use strict'

import formidable from 'formidable'
import ShopModel from '../../models/shopping/shop'
import AccountModel from '../../models/order/account'
import OrderModel from '../../models/order/order'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Order extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.create = this.create.bind(this)
    this.list = this.list.bind(this)
    this.detail = this.detail.bind(this)
    this.allList = this.allList.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 创建订单
  async create (req, res, next) {
    let userId = req.session.user_id
    let order_id
    try {
      order_id = await this.getId('order_id')
    } catch (err) {
      return res.send(Res.Fail(err.message || '订单id获取失败'))
    }

    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) return res.send(Res.Fail('formidable 初始化失败'))
      let { account_id, address_id = 0, restaurant_id, hongbao = 0, pay_type = 0, remarks = [], self_remarks = '', need_invoice = false, invoice = '' } = fields

      try {
        let va = new Validator()
        va.add(account_id, [{ rule: 'isEmpty', msg: '结算信息id不能为空' }])
        va.add(address_id, [{ rule: 'isEmpty', msg: '地址id不能为空' }])
        va.add(restaurant_id, [{ rule: 'isEmpty', msg: '商铺id不能为空' }])
        let vaResult = va.start()
        if (vaResult) {
          throw new Error(vaResult)
        }
      } catch (err) {
        return res.send(Res.Fail(err.message || 'id参数有误'))
      }

      try {
        let restaurant_info
        let account_info

        restaurant_info = await ShopModel.findOne({ id: +restaurant_id })
        if (!restaurant_info) {
          throw new Error('该商铺不存在，请核查商铺id')
        }

        account_info = await AccountModel.findOne({ id: +account_id })
        if (!account_info) {
          throw new Error('该结算信息不存在，请核查结算id')
        }

        if (need_invoice && Ju.isEmpty(invoice)) {
          return res.send(Res.Fail('发票抬头不能为空'))
        }

        let newOrder = {
          id: order_id,
          user_id: +userId,
          account_id: +account_id,
          address_id: +address_id,
          restaurant_id: +restaurant_id,
          hongbao,
          pay_type,
          remarks,
          self_remarks,
          need_invoice,
          invoice,
          status: 0,
          create_time: new Date().getTime(),
          due_time: new Date().getTime() + 15 * 60 * 1000,
          restaurant_name: restaurant_info.name,
          restaurant_image_url: restaurant_info.image_path,
          total_price: account_info.total_price - hongbao,
          deliver_fee: account_info.deliver_fee,
          extra: account_info.extra,
          manifest: account_info.manifest,
          delivery_mode: restaurant_info.delivery_mode
        }

        await OrderModel.create(newOrder)
        res.send(Res.Success(order_id))
      } catch (err) {
        res.send(Res.Fail(err.message || '订单创建失败'))
      }
    })
  }

  // 获取用户订单列表
  async list (req, res, next) {
    let userId = req.session.user_id
    let { offset = 0, limit = 20 } = req.query
    try {
      let orderList = await OrderModel.find({ user_id: userId }, '-_id').sort({ id: -1 }).skip(+offset).limit(+limit).lean()
      orderList.forEach(item => {
        if (new Date().getTime() > item.due_time) {
          item.status = -1
          item.statusTitle = '支付超时'
        } else {
          item.status = 0
          item.statusTitle = '等待支付'
        }
        // item.save()
      })
      res.send(Res.Success(orderList))
    } catch (err) {
      res.send(Res.Fail(err.message || '用户订单列表获取失败'))
    }
  }

  // 获取所有订单列表
  async allList (req, res, next) {
    let { offset = 0, limit = 20 } = req.query
    try {
      let orderList = await OrderModel.find({}, '-_id').sort({ id: -1 }).skip(+offset).limit(+limit).lean()
      orderList.forEach(item => {
        if (new Date().getTime() > item.due_time) {
          item.status = -1
          item.statusTitle = '支付超时'
        } else {
          item.status = 0
          item.statusTitle = '等待支付'
        }
        // item.save()
      })
      res.send(Res.Success(orderList))
    } catch (err) {
      res.send(Res.Fail(err.message || '所有订单列表获取失败'))
    }
  }

  // 获取订单详情
  async detail (req, res, next) {
    let orderId = req.params.id
    if (Ju.isEmpty(orderId)) {
      return res.send(Res.Fail('请输入订单id'))
    }
    try {
      let orderDetail = await OrderModel.findOne({ id: orderId }, '-_id')
      if (!orderDetail) {
        throw new Error('该订单不存在，请核查订单id是否正确')
      }
      res.send(Res.Success(orderDetail))
    } catch (err) {
      res.send(Res.Fail(err.message || '订单详情获取失败'))
    }
  }
}

export default new Order()
