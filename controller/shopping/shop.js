'use strict'

import formidable from 'formidable'
import ShopModel from '../../models/shopping/shop'
import LabelModel from '../../models/shopping/label'
import DeliveryModel from '../../models/shopping/delivery'
import ActivityModel from '../../models/shopping/activity'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Shop extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.addShop = this.addShop.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 添加商铺
  async addShop (req, res, next) {
    let shop_id

    try {
      shop_id = await this.getId('shop_id')
    } catch (err) {
      return res.send(Res.Fail(err.message || '商铺id获取失败'))
    }

    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) return res.send(Res.Fail('formidable 初始化失败'))
      try {
        let va = new Validator()
        va.add(fields.name, [{ rule: 'isEmpty', msg: '商铺名称不能为空' }])
        va.add(fields.address, [{ rule: 'isEmpty', msg: '商铺地址不能为空' }])
        va.add(fields.phone, [{ rule: 'isEmpty', msg: '电话不能为空' }])
        va.add(fields.latitude, [{ rule: 'isEmpty', msg: '经度不能为空' }])
        va.add(fields.longitude, [{ rule: 'isEmpty', msg: '纬度不能为空' }])
        va.add(fields.category, [{ rule: 'isEmpty', msg: '商铺分类不能为空' }])
        va.add(fields.image_path, [{ rule: 'isEmpty', msg: '商铺图片链接不能为空' }])
        va.add(fields.float_delivery_fee, [{ rule: 'isEmpty', msg: '配送费不能为空' }])
        va.add(fields.float_minimum_order_amount, [{ rule: 'isEmpty', msg: '起送价不能为空' }])
        let vaResult = va.start()
        if (vaResult) {
          throw new Error(vaResult)
        }

        let newShop = {
          id: shop_id,
          name: fields.name,
          address: fields.address,
          phone: +fields.phone,
          latitude: +fields.latitude,
          longitude: +fields.longitude,
          category: +fields.category,
          image_path: fields.image_path,
          float_delivery_fee: +fields.float_delivery_fee,
          float_minimum_order_amount: +fields.float_minimum_order_amount,
          description: fields.description || '客户您好，欢迎光临！',
          promotion_info: fields.promotion_info || '欢迎光临，用餐高峰请提前下单，谢谢',
          // is_pin: fields.is_pin || false,
          // is_bao: fields.is_bao || false,
          // is_new: fields.is_new || false,
          // is_piao: fields.is_piao || false,
          // is_fu: fields.is_fu || false,
          // is_zhun: fields.is_zhun || false,
          startTime: fields.startTime || '8:30',
          endTime: fields.endTime || '21:30',
          business_license_image: fields.business_license_image || 'http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg',
          catering_service_license_image: fields.catering_service_license_image || 'http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg',
          rating: fields.rating || (Math.random() * 5).toFixed(1),
          rating_count: fields.rating_count || Math.round(Math.random() * 10),
          recent_order_num: fields.recent_order_num || Math.round(Math.random() * 100),
          status: fields.status || Math.ceil(Math.random() * 10) > 5 ? 1 : 0,
          labels: fields.labels || [],
          delivery_mode: fields.delivery_mode || [],
          activities: fields.activities || []
        }

        // 获取商铺标签
        if (newShop.labels.length) {
          try {
            let labelData = await LabelModel.find({}, '-_id')
            let newlabels = []
            newShop.labels.forEach(item => {
              labelData.forEach(labelItem => {
                if (item === labelItem.id) {
                  newlabels.push(labelItem)
                }
              })
            })
            newShop.labels = newlabels
          } catch (err) {
            return res.send(Res.Fail(err.message || '获取标签信息失败'))
          }
        }

        // 获取支持的配送方式
        if (newShop.delivery_mode.length) {
          try {
            let deliveryData = await DeliveryModel.find({}, '-_id')
            let newdelivery = []
            newShop.delivery_mode.forEach(item => {
              deliveryData.forEach(labelItem => {
                if (item === labelItem.id) {
                  newdelivery.push(labelItem)
                }
              })
            })
            newShop.delivery_mode = newdelivery
          } catch (err) {
            return res.send(Res.Fail(err.message || '获取配送方式失败'))
          }
        } else {
          throw new Error('请至少选择一种配送方式')
        }

        let resObj = await ShopModel.create(newShop)
        res.send(Res.Success(resObj))
      } catch (err) {
        res.send(Res.Fail(err.message || '商铺添加失败'))
      }
    })
  }
}
export default new Shop()
