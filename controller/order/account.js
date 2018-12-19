'use strict'

import formidable from 'formidable'
import ShopModel from '../../models/shopping/shop'
import AccountModel from '../../models/order/account'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Account extends AddressComponent {
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

  // 创建并保存结算信息
  async create (req, res, next) {
    let userId = req.session.UID || 1
    if (!userId) {
      return res.send(Res.Fail('你还没有登录哦'))
    }
    let account_id
    try {
      account_id = await this.getId('account_id')
    } catch (err) {
      return res.send(Res.Fail(err.message || '结算id获取失败'))
    }

    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) return res.send(Res.Fail('formidable 初始化失败'))
      let { restaurant_id, extra = {}, manifest, deliver_fee = 0 } = fields
      let restaurant_info

      if (!restaurant_id) {
        return res.send(Res.Fail('商铺id不能为空'))
      }
      try {
        restaurant_info = await ShopModel.findOne({ id: +restaurant_id })
        if (!restaurant_info) {
          throw new Error('该商铺不存在')
        }
      } catch (err) {
        return res.send(Res.Fail(err.message || '获取商铺信息失败'))
      }

      if (!(manifest instanceof Array) || !manifest.length) {
        return res.send(Res.Fail('manifest参数有误'))
      }

      for (let item of manifest) {
        let va = new Validator()
        va.add(item.food_id, [{ rule: 'isEmpty', msg: '商品id不能为空' }])
        va.add(item.item_id, [{ rule: 'isEmpty', msg: '规格id不能为空' }])
        va.add(item.name, [{ rule: 'isEmpty', msg: '商品名称不能为空' }])
        va.add(item.price, [{ rule: 'isEmpty', msg: '商品价格不能为空' }])
        va.add(item.quantity, [{ rule: 'isEmpty', msg: '商品数量不能为空' }])
        va.add(item.packing_fee, [{ rule: 'isEmpty', msg: '商品打包费用不能为空' }])
        let vaResult = va.start()
        if (vaResult) {
          return res.send(Res.Fail(vaResult))
        }
      }

      if (!Object.keys(extra).length) {
        extra = this.getExtra()
      } else {
        let va = new Validator()
        va.add(extra.name, [{ rule: 'isEmpty', msg: 'extra字段名称不能为空' }])
        va.add(extra.price, [{ rule: 'isEmpty', msg: 'extra字段价格不能为空' }])
        va.add(extra.quantity, [{ rule: 'isEmpty', msg: 'extra字段数量不能为空' }])
        let vaResult = va.start()
        if (vaResult) {
          return res.send(Res.Fail(vaResult))
        }
      }

      let total_price = 0
      manifest.forEach(item => {
        total_price += item.price * item.quantity + item.packing_fee
      })
      total_price += deliver_fee
      total_price += extra.price * extra.quantity

      let newAccount = {
        id: account_id,
        user_id: +userId,
        restaurant_id: +restaurant_id,
        restaurant_info,
        deliver_fee,
        total_price,
        extra,
        manifest,
        status: 0
      }

      try {
        await AccountModel.create(newAccount)
        res.send(Res.Success('结算信息创建成功'))
      } catch (err) {
        res.send(Res.Fail(err.message || '结算信息创建失败'))
      }
    })
  }

  // 获取餐盒信息
  getExtra () {
    return {
      name: '餐盒费',
      price: 10,
      quantity: 1
    }
  }
}

export default new Account()
