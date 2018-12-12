'use strict'

import mongoose from 'mongoose'
import cityData from '../../initData/cities'

const citySchema = new mongoose.Schema(
  {
    data: {}
  },
  {
    versionKey: false
  }
)

citySchema.statics.cityHot = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let citys = await this.findOne()
      resolve(citys.data.hotCities)
    } catch (err) {
      reject(new Error(err.message || '获取热门城市列表失败'))
    }
  })
}

citySchema.statics.cityGroup = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let citys = await this.findOne()
      let cityGroup = citys.data
      delete cityGroup.hotCities
      resolve(cityGroup)
    } catch (err) {
      reject(new Error(err.message || '获取分组城市列表失败'))
    }
  })
}

citySchema.statics.cityById = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      let citys = await this.findOne()
      Object.entries(citys.data).forEach(item => {
        if (item[0] !== 'hotCities') {
          item[1].forEach(cityItem => {
            if (+cityItem.id === +id) {
              resolve(cityItem)
            }
          })
        }
      })
    } catch (err) {
      reject(new Error(err.message || '根据id获取城市信息失败'))
    }
  })
}

citySchema.statics.cityByName = function (name) {
  return new Promise(async (resolve, reject) => {
    name = name.toLowerCase()
    let firstLetter = name.substr(0, 1).toUpperCase()
    try {
      let citys = await this.findOne()
      Object.entries(citys.data).forEach(item => {
        if (item[0] === firstLetter) {
          item[1].forEach(cityItem => {
            if (cityItem.pinyin === name) {
              resolve(cityItem)
            }
          })
        }
      })
    } catch (err) {
      reject(new Error(err.message || '根据拼音获取城市信息失败'))
    }
  })
}

const City = mongoose.model('City', citySchema)

City.findOne((err, data) => {
  if (err) throw err
  if (!data) {
    City.create({ data: cityData })
  }
})

export default City
