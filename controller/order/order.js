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
    let userId = req.session.UID || 1
    if (!userId) {
      return res.send(Res.Fail('你还没有登录哦'))
    }
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
          create_time: new Date().getTime(),
          due_time: new Date().getTime() + 15 * 60 * 1000,
          restaurant_name: restaurant_info.name,
          restaurant_image_url: restaurant_info.image_path,
          total_price: account_info.total_price - hongbao,
          deliver_fee: account_info.deliver_fee,
          extra: account_info.extra,
          manifest: account_info.manifest
        }

        await OrderModel.create(newOrder)
        res.send(Res.Success('订单创建成功'))
      } catch (err) {
        res.send(Res.Fail(err.message || '订单创建失败'))
      }
    })
  }
}

export default new Order()
