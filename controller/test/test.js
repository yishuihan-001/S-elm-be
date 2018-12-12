'use strict'

import AddressComponent from '../../prototype/addressComponent'
import Res from '../../lib/res'

class Test extends AddressComponent {
  constructor () {
    super()
    this.testGetId = this.testGetId.bind(this)
    this.testUploadImg = this.testUploadImg.bind(this)
    this.testGuessCity = this.testGuessCity.bind(this)
    this.testSearchPlace = this.testSearchPlace.bind(this)
    this.testGetDistance = this.testGetDistance.bind(this)
    this.testGuessAddress = this.testGuessAddress.bind(this)
    this.testGetAddressByGeo = this.testGetAddressByGeo.bind(this)
  }
  default (req, res, next) {
    res.send(Res.Success('default'))
  }
  one (req, res, next) {
    res.send(Res.Success('one'))
  }
  // id
  async testGetId (req, res, next) {
    let { name } = req.params
    try {
      let id = await this.getId(name)
      res.send(Res.Success(id))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取id: ' + name + ' 失败t'))
    }
  }
  // 上传本地图片
  async testUploadImg (req, res, next) {
    try {
      await this.uploadImg(req, res, next)
    } catch (err) {
      res.send(Res.Fail(err.message || '图片上传失败t'))
    }
  }
  // 猜测城市
  async testGuessCity (req, res, next) {
    try {
      let city = await this.guessCity(req, res, next)
      res.send(Res.Success(city))
    } catch (err) {
      res.send(Res.Fail(err.message || '地址定位失败t'))
    }
  }
  // 搜索地址
  async testSearchPlace (req, res, next) {
    let { keyword, city } = req.query
    try {
      let resObj = await this.searchPlace(keyword, city)
      res.send(Res.Success(resObj))
    } catch (err) {
      res.send(Res.Fail(err.message || '地址定位失败t'))
    }
  }
  // 测距
  async testGetDistance (req, res, next) {
    let { from, to } = req.query
    try {
      let resObj = await this.getDistance(from, to, 'duration')
      res.send(Res.Success(resObj))
    } catch (err) {
      res.send(Res.Fail(err.message || '测距失败t'))
    }
  }
  // 猜测地址
  async testGuessAddress (req, res, next) {
    try {
      let resObj = await this.guessAddress(req)
      res.send(Res.Success(resObj))
    } catch (err) {
      res.send(Res.Fail(err.message || '通过ip定位失败t'))
    }
  }
  // 通过经纬度定位
  async testGetAddressByGeo (req, res, next) {
    let { lat, lng } = req.params
    try {
      let resObj = await this.getAddressByGeo(lat, lng)
      res.send(Res.Success(resObj))
    } catch (err) {
      res.send(Res.Fail(err.message || '通过经纬度定位失败t'))
    }
  }
}

export default new Test()
