'use strict'

import pinyin from 'pinyin'
import CityModel from '../../models/city/city'
import ShopModel from '../../models/shopping/shop'
import CategoryModel from '../../models/shopping/category'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class City extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.target = this.target.bind(this)
    this.getCityById = this.getCityById.bind(this)
    this.search = this.search.bind(this)
    this.getPosiByGeo = this.getPosiByGeo.bind(this)
    this.createShop = this.createShop.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 猜测城市 城市分组 热门城市
  async target (req, res, next) {
    let type = req.query.type || 'guess'
    let cityInfo
    try {
      switch (type) {
        case 'guess':
          let cityName = await this.getCityName(req, res)
          cityInfo = await CityModel.cityByName(cityName)
          break
        case 'cityHot':
          cityInfo = await CityModel.cityHot()
          break
        case 'cityGroup':
          cityInfo = await CityModel.cityGroup()
          break
        default:
          return res.send(Res.Fail('获取城市失败'))
      }
      res.send(Res.Success(cityInfo))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取城市失败c'))
    }
  }

  // 根据城市名称（拼音）获取城市信息
  async getCityName (req, res) {
    let targetCity
    try {
      targetCity = await this.guessCity(req)
    } catch (err) {
      return res.send(Res.Fail(err.message || '定位城市失败'))
    }
    /**
     * 汉字转换成拼音
     */
    let pinyinArr = pinyin(targetCity.city, {
      style: pinyin.STYLE_NORMAL
    })
    let cityName = ''
    pinyinArr.forEach(item => {
      cityName += item[0]
    })
    return cityName
  }

  // 根据城市id获取城市信息
  async getCityById (req, res, next) {
    let cityId = req.params.id
    if (isNaN(cityId)) {
      return res.send(Res.Fail('城市id错误'))
    }
    try {
      let cityInfo = await CityModel.cityById(cityId)
      res.send(Res.Success(cityInfo))
    } catch (err) {
      res.send(Res.Fail(err.message || '根据id获取城市信息失败'))
    }
  }

  // 搜索关键词
  async search (req, res, next) {
    let { cityId, keyword } = req.query

    try {
      let va = new Validator()
      va.add(cityId, [{ rule: 'isEmpty', msg: '城市id不正确' }])
      va.add(keyword, [{ rule: 'isEmpty', msg: '缺少关键词' }])
      let vaResult = va.start()
      if (vaResult) {
        throw new Error(vaResult)
      }
    } catch (err) {
      return res.send(Res.Fail(err.message || '参数错误'))
    }
    try {
      let cityInfo = await CityModel.cityById(cityId)
      let resData = await this.searchPlace(keyword, cityInfo.name)
      res.send(Res.Success(resData))
    } catch (err) {
      res.send(Res.Fail(err.message || '搜索失败'))
    }
  }

  // 根据经纬度获取地址信息
  async getPosiByGeo (req, res, next) {
    let { lng, lat } = req.query

    try {
      let va = new Validator()
      va.add(lng, [{ rule: 'isEmpty', msg: '经度信息不能为空' }])
      va.add(lat, [{ rule: 'isEmpty', msg: '纬度信息不能为空' }])
      let vaResult = va.start()
      if (vaResult) {
        throw new Error(vaResult)
      }
    } catch (err) {
      return res.send(Res.Fail(err.message || '经纬度参数错误'))
    }

    try {
      let cityInfo = await this.getAddressByGeo(lat, lng)
      res.send(Res.Success(cityInfo))
    } catch (err) {
      res.send(Res.Fail(err.message || '根据经纬度获取地址信息失败'))
    }
  }

  // 创建商铺
  async createShop (req, res, next) {
    let { cityId, keyword } = req.query

    try {
      let va = new Validator()
      va.add(cityId, [{ rule: 'isEmpty', msg: '城市id不正确' }])
      va.add(keyword, [{ rule: 'isEmpty', msg: '缺少关键词' }])
      let vaResult = va.start()
      if (vaResult) {
        throw new Error(vaResult)
      }
    } catch (err) {
      return res.send(Res.Fail(err.message || '参数错误'))
    }

    let searchData
    let adjustData = []
    let fooId
    let categoryList
    let categoryIdList = []

    try {
      let cityInfo = await CityModel.cityById(cityId)
      searchData = await this.searchPlace(keyword, cityInfo.name)
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
        labels: [],
        delivery_mode: [],
        activities: []
      })
    })

    adjustData.forEach(async item => {
      await ShopModel.create(item)
    })
    res.send(Res.Success('搜索商铺添加成功'))
  }
}
export default new City()
