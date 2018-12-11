'use strict'

import Cities from '../../models/v1/cities'
import pinyin from 'pinyin'
import AddressComponent from '../../prototype/addressComponent'
import Res from '../../lib/res'

class CityHandle extends AddressComponent {
  constructor () {
    super()
    this.getCity = this.getCity.bind(this)
    this.getExactAddress = this.getExactAddress.bind(this)
    this.pois = this.pois.bind(this)
  }
  async getCity (req, res, next) {
    const type = req.query.type
    let cityInfo
    try {
      switch (type) {
        case 'guess':
          const city = await this.getCityName(req, res)
          cityInfo = await Cities.cityGuess(city)
          break
        case 'hot':
          cityInfo = await Cities.cityHot()
          break
        case 'group':
          cityInfo = await Cities.cityGroup()
          break
        default:
          throw new Error('参数错误')
      }
      res.send(Res.Success(cityInfo))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取数据失败'))
    }
  }
  async getCityById (req, res, next) {
    const cityid = req.params.id
    if (isNaN(cityid)) {
      return res.send(Res.Fail('参数错误'))
    }
    try {
      const cityInfo = await Cities.getCityById(cityid)
      res.send(Res.Success(cityInfo))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取数据失败'))
    }
  }
  async getCityName (req, res) {
    let cityInfo
    try {
      cityInfo = await this.guessPosition(req)
    } catch (err) {
      return res.send(Res.Fail(err.message || '获取IP位置信息失败'))
    }
    /* 汉字转换成拼音 */
    const pinyinArr = pinyin(cityInfo.city, {
      style: pinyin.STYLE_NORMAL
    })
    let cityName = ''
    pinyinArr.forEach(item => {
      cityName += item[0]
    })
    return cityName
  }
  async getExactAddress (req, res, next) {
    try {
      const position = await this.geocoder(req)
      res.send(Res.Success(position))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取精确位置信息失败'))
    }
  }
  async pois (req, res, next) {
    const geohash = req.params.geohash
    try {
      if (geohash.indexOf(',') === -1) {
        throw new Error('参数错误')
      }
    } catch (err) {
      return res.send(Res.Fail(err.message || '参数错误'))
    }
    const poisArr = geohash.split(',')
    try {
      const result = await this.getpois(poisArr[0], poisArr[1])
      const address = {
        address: result.result.address,
        city: result.result.address_component.province,
        geohash,
        latitude: poisArr[0],
        longitude: poisArr[1],
        name: result.result.formatted_addresses.recommend
      }
      res.send(Res.Success(address))
    } catch (err) {
      res.send(Res.Fail(err.message || 'getpois返回信息失败'))
    }
  }
}
export default new CityHandle()
