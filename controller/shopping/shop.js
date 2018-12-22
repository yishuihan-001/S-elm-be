'use strict'

import formidable from 'formidable'
import CityModel from '../../models/city/city'
import CategoryModel from '../../models/shopping/category'
import ShopModel from '../../models/shopping/shop'
import MenuModel from '../../models/shopping/menu'
import FoodModel from '../../models/shopping/food'
import LabelModel from '../../models/shopping/label'
import DeliveryModel from '../../models/shopping/delivery'
import ActivityModel from '../../models/shopping/activity'
import RateModel from '../../models/shopping/rate'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Shop extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.addShop = this.addShop.bind(this)
    this.updateShop = this.updateShop.bind(this)
    this.deleteShop = this.deleteShop.bind(this)
    this.searchShop = this.searchShop.bind(this)
    this.shopDetail = this.shopDetail.bind(this)
    this.getList = this.getList.bind(this)
    this.getCount = this.getCount.bind(this)
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
        va.add(fields.category_id, [{ rule: 'isEmpty', msg: '商铺种类不能为空' }])
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
          category_id: +fields.category_id,
          image_path: fields.image_path,
          float_delivery_fee: +fields.float_delivery_fee,
          float_minimum_order_amount: +fields.float_minimum_order_amount,
          description: fields.description || '客户您好，欢迎光临！',
          promotion_info: fields.promotion_info || '欢迎光临，用餐高峰请提前下单，谢谢',
          startTime: fields.startTime || '8:30',
          endTime: fields.endTime || '21:30',
          business_license_image: fields.business_license_image || 'http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg',
          catering_service_license_image: fields.catering_service_license_image || 'http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg',
          rating: +fields.rating || (Math.random() * 5).toFixed(1),
          rating_count: +fields.rating_count || Math.round(Math.random() * 10),
          recent_order_num: +fields.recent_order_num || Math.round(Math.random() * 100),
          status: +fields.status || Math.ceil(Math.random() * 10) > 5 ? 1 : 0,
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
              deliveryData.forEach(deliveryItem => {
                if (item === deliveryItem.id) {
                  newdelivery.push(deliveryItem)
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

        // 获取商铺活动
        if (newShop.activities.length) {
          try {
            let activityData = await ActivityModel.find({}, '-_id')
            let newActivities = []
            newShop.activities.forEach(item => {
              activityData.forEach(activitylItem => {
                if (item === activitylItem.id) {
                  newActivities.push(activitylItem)
                }
              })
            })
            newShop.activities = newActivities
          } catch (err) {
            return res.send(Res.Fail(err.message || '获取标签信息失败'))
          }
        }

        await ShopModel.create(newShop)
        await RateModel.initData(shop_id)
        res.send(Res.Success('商铺添加成功'))
      } catch (err) {
        res.send(Res.Fail(err.message || '商铺添加失败'))
      }
    })
  }

  // 更新商铺
  async updateShop (req, res, next) {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) return res.send(Res.Fail('formidable 初始化失败'))
      let { id, name, address, phone, category_id, image_path, latitude, longitude } = fields
      try {
        let va = new Validator()
        va.add(id, [{ rule: 'isEmpty', msg: '商铺id不能为空' }])
        va.add(name, [{ rule: 'isEmpty', msg: '商铺名称不能为空' }])
        va.add(address, [{ rule: 'isEmpty', msg: '商铺地址不能为空' }])
        va.add(phone, [{ rule: 'isEmpty', msg: '电话不能为空' }])
        va.add(category_id, [{ rule: 'isEmpty', msg: '商铺分类不能为空' }])
        va.add(image_path, [{ rule: 'isEmpty', msg: '商铺图片链接不能为空' }])
        let vaResult = va.start()
        if (vaResult) {
          throw new Error(vaResult)
        }

        let updateData
        if (latitude && longitude) {
          updateData = { id, name, address, phone, category_id, image_path, latitude, longitude }
        } else {
          updateData = { id, name, address, phone, category_id, image_path }
        }

        let targetShop = await ShopModel.findOne({ id: updateData.id })
        let targetCategory = await CategoryModel.findOne({ id: updateData.category_id })
        if (!targetShop) {
          throw new Error('该商铺不存在')
        } else if (!targetCategory) {
          throw new Error('该商铺种类不存在')
        }

        await ShopModel.findOneAndUpdate({ id }, { $set: updateData })
        res.send(Res.Success('商铺信息修改成功'))
      } catch (err) {
        res.send(Res.Fail(err.message || '商铺信息更新失败'))
      }
    })
  }

  // 删除商铺
  async deleteShop (req, res, next) {
    let restaurant_id = +req.params.id
    if (Ju.isEmpty(restaurant_id)) {
      return res.send(Res.Fail('商铺id不能为空'))
    }

    let targetShop = await ShopModel.findOne({ id: restaurant_id })
    if (!targetShop) {
      return res.send(Res.Fail('该商铺不存在'))
    }

    try {
      await Promise.all([
        await ShopModel.remove({ id: restaurant_id }),
        await MenuModel.remove({ restaurant_id: restaurant_id }),
        await FoodModel.remove({ restaurant_id: restaurant_id })
      ])
      res.send(Res.Success('商铺删除成功'))
    } catch (err) {
      res.send(Res.Fail(err.message || '删除商铺失败'))
    }
  }

  // 删除商铺
  // step 1 删除商铺
  async deleteShopOne (id) {
    let resObj = await ShopModel.remove({ id: id })
    return resObj
  }
  // step 2 删除分类
  async deleteShopTwo (id) {
    let resObj = await MenuModel.remove({ restaurant_id: id })
    return resObj
  }
  // step 1 删除食品
  async deleteShopThree (id) {
    let resObj = await FoodModel.remove({ restaurant_id: id })
    return resObj
  }

  // 搜索商铺
  async searchShop (req, res, next) {
    let { lng, lat, keyword, cityId } = req.query

    try {
      let va = new Validator()
      va.add(lng, [{ rule: 'isEmpty', msg: '经度信息不能为空' }])
      va.add(lat, [{ rule: 'isEmpty', msg: '纬度信息不能为空' }])
      va.add(keyword, [{ rule: 'isEmpty', msg: '搜索关键词不能为空' }])
      let vaResult = va.start()
      if (vaResult) {
        throw new Error(vaResult)
      }
    } catch (err) {
      return res.send(Res.Fail(err.message || '参数错误'))
    }

    try {
      let searchList = await ShopModel.find({ name: eval('/' + keyword + '/gi') }, '-_id').limit(50).lean()
      let newSearchList = []
      if (searchList.length) {
        let from = lat + ',' + lng
        let to = ''
        // 获取百度地图测局所需经度纬度
        searchList.forEach((item, index) => {
          const slpitStr = (index === searchList.length - 1) ? '' : '|'
          to += item.latitude + ',' + item.longitude + slpitStr
        })
        // 获取距离信息，并合并到数据中
        let distance_duration = await this.getDistance(from, to)
        newSearchList = searchList.map((item, index) => {
          return Object.assign(item, distance_duration[index])
        })
        res.send(Res.Success(newSearchList))
      } else {
        await this.createShopBeforeSearch(req, res, next, keyword, cityId)
      }
    } catch (err) {
      res.send(Res.Fail(err.message || '搜索失败'))
    }
  }

  // 搜索前创建商铺
  async createShopBeforeSearch (req, res, next, keyword, cityId) {
    let guessCityInfo
    if (Ju.isEmpty(cityId)) {
      try {
        guessCityInfo = await this.guessCity(req)
      } catch (err) {
        return res.send(Res.Fail(err.message || '搜索创建商铺时定位失败'))
      }
    } else {
      try {
        guessCityInfo = await CityModel.cityById(+cityId)
      } catch (err) {
        return res.send(Res.Fail(err.message || '搜索创建商铺时通过id查找城市失败'))
      }
    }

    let searchData
    let adjustData = []
    let fooId
    let categoryList
    let categoryIdList = []

    try {
      searchData = await this.searchPlace(keyword, guessCityInfo.city || guessCityInfo.name)
    } catch (err) {
      return res.send(Res.Fail(err.message || '搜索失败'))
    }
    fooId = await this.getId('item_id', searchData.length)
    fooId -= searchData.length

    try {
      categoryList = await CategoryModel.find({})
    } catch (err) {
      return res.send(Res.Fail(err.message || '商铺id查找失败'))
    }

    categoryList.forEach(item => {
      categoryIdList.push(item.id)
    })

    let labelsArr = []
    let deliveryArr = []
    let activityArr = []

    try {
      let labelData = await LabelModel.find({}, '-_id')
      for (let item of searchData) {
        let labelNum = Math.floor((Math.random() * Math.ceil(labelData.length / 2)))
        let labelObj = []
        for (let i = 0; i < labelNum; i++) {
          labelObj.push(labelData[Math.floor((Math.random() * labelData.length))])
        }
        labelsArr.push(labelObj)
      }
    } catch (err) {
      return res.send(Res.Fail(err.message || '获取标签信息失败'))
    }

    try {
      let deliveryData = await DeliveryModel.find({}, '-_id')
      for (let item of searchData) {
        let deliveryNum = Math.floor((Math.random() * deliveryData.length))
        let deliveryObj = []
        for (let i = 0; i < deliveryNum; i++) {
          deliveryObj.push(deliveryData[Math.floor((Math.random() * deliveryData.length))])
        }
        deliveryArr.push(deliveryObj)
      }
    } catch (err) {
      return res.send(Res.Fail(err.message || '获取配送信息失败'))
    }

    try {
      let activityData = await ActivityModel.find({}, '-_id')
      for (let item of searchData) {
        let activityNum = Math.floor((Math.random() * Math.ceil(activityData.length / 2)))
        let activityObj = []
        for (let i = 0; i < activityNum; i++) {
          activityObj.push(activityData[Math.floor((Math.random() * activityData.length))])
        }
        activityArr.push(activityObj)
      }
    } catch (err) {
      return res.send(Res.Fail(err.message || '获取配送信息失败'))
    }

    searchData.forEach((item, index) => {
      adjustData.push({
        id: fooId + index + 1,
        name: item.title,
        address: item.address,
        phone: item.tel,
        latitude: +item.location.lat,
        longitude: +item.location.lng,
        category_id: categoryIdList[Math.floor((Math.random() * 16))],
        image_path: 'http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg',
        float_delivery_fee: Math.floor((Math.random() * 15)) + 5,
        float_minimum_order_amount: Math.floor((Math.random() * 100)) + 20,
        description: '客户您好，欢迎光临！',
        promotion_info: '欢迎光临，用餐高峰请提前下单，谢谢',
        startTime: '8:30',
        endTime: '21:30',
        business_license_image: 'http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg',
        catering_service_license_image: 'http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg',
        rating: (Math.random() * 5).toFixed(1),
        rating_count: Math.round(Math.random() * 10),
        recent_order_num: Math.round(Math.random() * 100),
        status: Math.ceil(Math.random() * 10) > 5 ? 1 : 0,
        labels: labelsArr[index],
        delivery_mode: deliveryArr[index],
        activities: activityArr[index]
      })
    })
    adjustData.forEach(async item => {
      await ShopModel.create(item)
      await RateModel.initData(item.id)
    })
    res.send(Res.Fail('服务器繁忙，请重试'))
  }

  // 商铺详情
  async shopDetail (req, res, next) {
    let id = req.params.id
    if (Ju.isEmpty(id)) {
      return res.send(res.Fail('商铺id不能为空'))
    }

    try {
      let targetShop = await ShopModel.findOne({ id }, '-_id')
      if (!targetShop) {
        res.send(Res.Fail('该商铺不存在'))
      } else {
        res.send(Res.Success(targetShop))
      }
    } catch (err) {
      res.send(res.Fail(err.message || '获取商铺详情失败'))
    }
  }

  // 商铺列表
  async getList (req, res, next) {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) return res.send(Res.Fail('formidable 初始化失败'))
      let { category_id, latitude, longitude, offset = 0, limit = 20, order_by, delivery_mode = [], activities = [] } = fields

      try {
        let va = new Validator()
        va.add(category_id, [{ rule: 'isEmpty', msg: '分类id不能为空' }])
        va.add(latitude, [{ rule: 'isEmpty', msg: '经度不能为空' }])
        va.add(longitude, [{ rule: 'isEmpty', msg: '纬度不能为空' }])
        let vaResult = va.start()
        if (vaResult) {
          throw new Error(vaResult)
        }
      } catch (err) {
        return res.send(Res.Fail(err.message || '获取商铺列表失败'))
      }

      try {
        let targetCategory = await CategoryModel.find({ id: +category_id })
        if (!targetCategory) {
          throw new Error('该分类不存在')
        }
      } catch (err) {
        return res.send(Res.Fail(err.message || '请检查分类id'))
      }

      let filter = { category_id }
      let sortBy = {}
      if (Number(order_by)) {
        switch (Number(order_by)) {
          case 1: // 起送价
            Object.assign(sortBy, { float_minimum_order_amount: 1 })
            break
          case 2: // 评分
            Object.assign(sortBy, { rating: -1 })
            break
          case 3: // 销量
            Object.assign(sortBy, { recent_order_num: -1 })
            break
          default:
            break
        }
      }

      // 支持的配送方式
      if (delivery_mode.length) {
        Object.assign(filter, { 'delivery_mode.id': { $in: delivery_mode } })
      }

      // 支持的活动
      if (activities.length) {
        Object.assign(filter, { 'activities.id': { $all: activities } })
      }

      try {
        let shopList = await ShopModel.find(filter, '-_id').sort(sortBy).limit(Number(limit)).skip(Number(offset)).lean()
        let from = latitude + ',' + longitude
        let to = ''
        // 获取百度地图测局所需经度纬度
        shopList.forEach((item, index) => {
          const slpitStr = (index === shopList.length - 1) ? '' : '|'
          to += item.latitude + ',' + item.longitude + slpitStr
        })

        let allIn = true
        if (shopList.length) {
          try {
            let distanceArr = await this.getDistance(from, to)
            shopList.forEach((item, index) => {
              Object.assign(item, distanceArr[index])
            })
          } catch (err) {
            allIn = false
            shopList.forEach((item, index) => {
              Object.assign(item, {
                distanceText: '未知',
                distanceValue: '未知',
                durationText: '未知',
                durationValue: '未知'
              })
            })
          }
        }

        if (allIn) {
          switch (Number(order_by)) {
            case 4: // 配送距离
              shopList = shopList.sort(this.compare('distanceValue'))
              break
            case 5: // 配送时间
              shopList = shopList.sort(this.compare('durationValue'))
              break
            default:
              break
          }
        }

        // let amountArr = []
        // let ratingArr = []
        // let numArr = []
        // let distanceArr = []
        // let durationArr = []
        // shopList.forEach(item => {
        //   amountArr.push(item.float_minimum_order_amount)
        //   ratingArr.push(item.rating)
        //   numArr.push(item.recent_order_num)
        //   distanceArr.push(item.distanceValue)
        //   durationArr.push(item.durationValue)
        // })
        // console.log(amountArr)
        // console.log(ratingArr)
        // console.log(numArr)
        // console.log(distanceArr)
        // console.log(durationArr)
        console.log(shopList.length)
        res.send(Res.Success(shopList))
      } catch (err) {
        res.send(Res.Fail(err.message || '获取商铺列表失败'))
      }
    })
  }

  // 获取商铺数量
  async getCount (req, res, next) {
    try {
      let count = await ShopModel.count()
      res.send(Res.Success(count))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取商铺数量失败'))
    }
  }

  // 属性排序方式
  compare (pro) {
    return function (obj1, obj2) {
      var val1 = obj1[pro]
      var val2 = obj2[pro]
      if (val1 > val2) {
        return 1
      } else if (val1 < val2) {
        return -1
      } else {
        return 0
      }
    }
  }
}
export default new Shop()
