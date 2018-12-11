'use strict'

import AddressComponent from '../../prototype/addressComponent'
import Cities from '../../models/v1/cities'
import CityHandle from './cities'
import Res from '../../lib/res'

class SearchPlace extends AddressComponent {
  constructor () {
    super()
    this.search = this.search.bind(this)
  }
  async search (req, res, next) {
    let { type = 'search', city_id, keyword } = req.query
    if (!keyword) {
      return res.send(Res.Fail('参数错误'))
    } else if (isNaN(city_id)) {
      try {
        const cityname = await CityHandle.getCityName(req, res)
        const cityInfo = await Cities.cityGuess(cityname)
        city_id = cityInfo.id
      } catch (err) {
        return res.send(Res.Fail(err.message || '搜索地址时，获取定位城失败'))
      }
    }
    try {
      const cityInfo = await Cities.getCityById(city_id)
      const resObj = await this.searchPlace(keyword, cityInfo.name, type)
      const cityList = []
      resObj.data.forEach((item, index) => {
        cityList.push({
          name: item.title,
          address: item.address,
          latitude: item.location.lat,
          longitude: item.location.lng,
          geohash: item.location.lat + ',' + item.location.lng
        })
      })
      res.send(Res.Success(cityList))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取地址信息失败'))
    }
  }
}

export default new SearchPlace()
