import fetch from 'node-fetch'
import Ids from '../models/ids'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'
import qiniu from 'qiniu'
import gm from 'gm'
import Res from '../lib/res'
qiniu.conf.ACCESS_KEY = 'hfogdQtxPwHjC7Xy8vlHeXxVjqdnX5NfN3pOnPvA'
qiniu.conf.SECRET_KEY = 'V1536udnQGJsRx0QzyaEFW2bxIZji01vmd2Jy-gB'

export default class BaseComponent {
  constructor () {
    this.idList = [
      'restaurant_id',
      'food_id',
      'order_id',
      'user_id',
      'address_id',
      'cart_id',
      'img_id',
      'category_id',
      'item_id',
      'sku_id',
      'admin_id',
      'statis_id'
    ]
    this.imgTypeList = ['shop', 'food', 'avatar', 'default']
    this.uploadImg = this.uploadImg.bind(this)
    this.qiniu = this.qiniu.bind(this)
  }
  async fetch (url = '', data = {}, type = 'GET', resType = 'JSON') {
    type = type.toUpperCase()
    resType = resType.toUpperCase()
    if (type === 'GET') {
      let dataStr = '' // 数据拼接字符串
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })

      if (dataStr !== '') {
        dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
    }

    let requestConfig = {
      method: type,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    if (type === 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }
    let responseJson
    try {
      const response = await fetch(url, requestConfig)
      if (resType === 'TEXT') {
        responseJson = await response.text()
      } else {
        responseJson = await response.json()
      }
    } catch (err) {
      throw new Error(err.message || '获取http数据失败')
    }
    return responseJson
  }
  // 获取id列表
  async getId (type) {
    if (!this.idList.includes(type)) {
      throw new Error('id类型错误')
    }
    try {
      const idData = await Ids.findOne()
      idData[type]++
      await idData.save()
      return idData[type]
    } catch (err) {
      throw new Error(err.message || '获取ID数据失败')
    }
  }

  async uploadImg (req, res, next) {
    // const type = req.params.type
    try {
      // const image_path = await this.qiniu(req, type)
      const image_path = await this.getPath(req)
      res.send(Res.Success(image_path))
    } catch (err) {
      res.send(Res.Fail(err.message || '上传图片失败'))
    }
  }

  async getPath (req) {
    return new Promise((resolve, reject) => {
      const form = formidable.IncomingForm()
      form.uploadDir = './public/img'
      form.parse(req, async (err, fields, files) => {
        if (err) throw err
        let img_id
        try {
          img_id = await this.getId('img_id')
        } catch (err) {
          fs.unlink(files.file.path)
          reject(new Error(err.message || '获取图片id失败'))
        }
        const imgName =
          (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(
            16
          ) + img_id
        console.log('===> start')
        console.log(JSON.stringify(fields))
        console.log(JSON.stringify(files))
        const fullName = imgName + path.extname(files.file.name)
        const repath = './public/img/' + fullName
        try {
          await fs.rename(files.file.path, repath)
          // gm(repath)
          //   .resize(100, 100, '!')
          //   .write(repath, async err => {
          //     if (err) {
          //       return reject(new Error('裁切图片失败'))
          //     }
          //     resolve(fullName)
          //   })
          resolve(fullName)
        } catch (err) {
          fs.unlink(files.file.path)
          reject(new Error(err.message || '保存图片失败'))
        }
      })
    })
  }

  async qiniu (req, type = 'default') {
    return new Promise((resolve, reject) => {
      const form = formidable.IncomingForm()
      form.uploadDir = './public/img'
      form.parse(req, async (err, fields, files) => {
        if (err) throw err
        let img_id
        try {
          img_id = await this.getId('img_id')
        } catch (err) {
          fs.unlink(files.file.path)
          reject(new Error(err.message || '获取图片id失败'))
        }
        const imgName =
          (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(
            16
          ) + img_id
        const extname = path.extname(files.file.name)
        const repath = './public/img/' + imgName + extname
        try {
          const key = imgName + extname
          await fs.rename(files.file.path, repath)
          const token = this.uptoken('s-elm', key)
          const qiniuImg = await this.uploadFile(token.toString(), key, repath)
          fs.unlink(repath)
          resolve(qiniuImg)
        } catch (err) {
          fs.unlink(files.file.path)
          reject(new Error(err.message || '保存至七牛失败'))
        }
      })
    })
  }
  uptoken (bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket + ':' + key)
    return putPolicy.token()
  }
  uploadFile (uptoken, key, localFile) {
    return new Promise((resolve, reject) => {
      var extra = new qiniu.io.PutExtra()
      qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
        if (!err) {
          resolve(ret.key)
        } else {
          reject(new Error(err.message || '图片上传至七牛失败'))
        }
      })
    })
  }
}
