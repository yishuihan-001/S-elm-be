'use strict'

import pinyin from 'pinyin'
import AddressComponent from '../../prototype/addressComponent'
import CityModel from '../../models/city/city'
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
}
export default new City()
