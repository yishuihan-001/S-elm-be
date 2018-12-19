'use strict'

import BaseComponent from './baseComponent'

/*
腾讯地图和百度地图API统一调配组件
 */
class AddressComponent extends BaseComponent {
  constructor () {
    super()
    this.tencentkey = 'ISABZ-W7U35-BSBI3-QBOSK-ACI7J-2NFLW'
    this.tencentkey2 = 'KF2BZ-FKSHJ-66SFT-KQOYT-7HVVO-C7BYP'
    this.baidukey = 'PbyU8Y7urkTUQmWVOwZhlkxdDkLgbVo5'
    this.baidukey2 = 'bYeu9xUGOzk4GnYI3UhVLVAWWdVFZyRM'
  }
  // 获取定位地址
  async guessCity (req) {
    return new Promise(async (resolve, reject) => {
      let ip =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress
      // 测试环境下，取得ip的值为::1，生产环境下，则会取得相应的正确ip
      let ipArr = ip.split(':')
      ip = ipArr[ipArr.length - 1]
      if (process.env.NODE_ENV === 'development') {
        ip = '106.38.50.170'
      }
      try {
        let resObj = await this.fetch(
          'https://apis.map.qq.com/ws/location/v1/ip',
          {
            ip,
            key: this.tencentkey
          }
        )
        if (resObj.status !== 0) {
          resObj = await this.fetch(
            'https://apis.map.qq.com/ws/location/v1/ip',
            {
              ip,
              key: this.tencentkey2
            }
          )
        }
        if (resObj.status === 0) {
          let cityInfo = {
            lat: resObj.result.location.lat,
            lng: resObj.result.location.lng,
            city: resObj.result.ad_info.city
          }
          cityInfo.city = cityInfo.city.replace(/市$/, '')
          resolve(cityInfo)
        } else {
          reject(new Error('定位失败'))
        }
      } catch (err) {
        reject(err.message || '定位失败c')
      }
    })
  }
  // 搜索地址
  async searchPlace (keyword, cityName) {
    return new Promise(async (resolve, reject) => {
      try {
        let resObj = await this.fetch(
          'https://apis.map.qq.com/ws/place/v1/search',
          {
            key: this.tencentkey,
            keyword: encodeURIComponent(keyword),
            boundary: 'region(' + encodeURIComponent(cityName) + ',0)',
            page_size: 20
          }
        )
        if (resObj.status === 0) {
          resolve(resObj.data)
        } else {
          throw new Error('搜索位置信息失败')
        }
      } catch (err) {
        reject(new Error(err.message || '搜索位置信息失败c'))
      }
    })
  }
  // 测量距离
  async getDistance (from, to) {
    /**
     * from: 40.07135,116.32081|39.83532,116.37118
     * to: 40.063597,116.364973|38.947508,116.97413
     * 百度地图测距参数释疑
     * 起点和终点经纬度坐标用|分隔，如上，以两层循环方式测距
     * 返回值
     * [{
     *  "distance": {
     *    "text": "157.7公里",
     *    "value": 157742
     *  }
     *  "duration": {
     *    "text": "1.6小时",
     *    "value": 5915
     *  }
     * }]
     */
    return new Promise(async (resolve, reject) => {
      try {
        let resObj
        resObj = await this.fetch(
          'https://api.map.baidu.com/routematrix/v2/driving',
          {
            ak: this.baidukey,
            output: 'json',
            origins: from,
            destinations: to
          }
        )
        if (resObj.status !== 0) {
          resObj = await this.fetch(
            'https://api.map.baidu.com/routematrix/v2/driving',
            {
              ak: this.baidukey2,
              output: 'json',
              origins: from,
              destinations: to
            }
          )
        }
        if (resObj.status === 0) {
          let resArr = []
          resObj.result.forEach(item => {
            resArr.push({
              distanceText: item.distance.text,
              distanceValue: item.distance.value,
              durationText: item.duration.text,
              durationValue: item.duration.value
            })
          })
          resolve(resArr)
        } else {
          throw new Error('调用百度地图测距失败')
        }
      } catch (err) {
        reject(new Error(err.message || '获取位置距离失败c'))
      }
    })
  }
  // 通过ip地址获取精确位置
  async guessAddress (req) {
    return new Promise(async (resolve, reject) => {
      try {
        let city = await this.guessCity(req)
        let resObj = await this.fetch('https://apis.map.qq.com/ws/geocoder/v1/', {
          key: this.tencentkey,
          location: city.lat + ',' + city.lng
        })
        if (resObj.status === 0) {
          let resData = {
            address: resObj.result.address,
            ad_info: resObj.result.ad_info
          }
          resolve(resData)
        } else {
          throw new Error('获取具体位置信息失败')
        }
      } catch (err) {
        reject(new Error(err.message || '获取具体位置信息失败c'))
      }
    })
  }
  // 通过geo获取精确位置
  async getAddressByGeo (lat, lng) {
    return new Promise(async (resolve, reject) => {
      try {
        let resObj = await this.fetch('https://apis.map.qq.com/ws/geocoder/v1/', {
          key: this.tencentkey,
          location: lat + ',' + lng
        })
        if (resObj.status === 0) {
          let resData = {
            address: resObj.result.address,
            ad_info: resObj.result.ad_info
          }
          resolve(resData)
        } else {
          throw new Error('通过获geo取具体位置失败')
        }
      } catch (err) {
        reject(new Error(err.message || '通过获geo取具体位置失败c'))
      }
    })
  }
}

export default AddressComponent
