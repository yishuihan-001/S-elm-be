import fetch from 'node-fetch'
import IdModel from '../models/ids'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'
import qiniu from 'qiniu'
import gm from 'gm'
import Res from '../lib/res'

const accessKey = 'hfogdQtxPwHjC7Xy8vlHeXxVjqdnX5NfN3pOnPvA'
const secretKey = 'V1536udnQGJsRx0QzyaEFW2bxIZji01vmd2Jy-gB'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const config = new qiniu.conf.Config()

export default class BaseComponent {
  constructor () {
    this.idList = [
      'test_id',
      'img_id',
      'static_id',
      'shop_id',
      'menu_id',
      'food_id',
      'item_id',
      'account_id',
      'order_id',
      'user_id',
      'address_id',
      'admin_id'
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
      let response = await fetch(url, requestConfig)
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
  async getId (type, num) {
    if (!this.idList.includes(type)) {
      throw new Error('id类型错误')
    }
    try {
      let idData = await IdModel.findOne({ name: type })
      if (!idData) {
        let newIdData = {
          name: type,
          value: 1
        }
        idData = await IdModel.create(newIdData)
      } else {
        if (num) {
          idData.value += num
        } else {
          idData.value++
        }
        idData.save()
      }
      return idData.value
    } catch (err) {
      throw new Error(err.message || '获取ID数据失败')
    }
  }

  async uploadImg (req, res, next) {
    let image_path
    try {
      if (process.env.NODE_ENV === 'development') {
        image_path = await this.getPath(req)
      } else {
        image_path = await this.qiniu(req)
      }
      return image_path
    } catch (err) {
      throw new Error(err.message || '图片上传失败-uploadImg')
    }
  }

  async getPath (req) {
    return new Promise((resolve, reject) => {
      let form = formidable.IncomingForm()
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
        let imgName =
          (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(
            16
          ) + img_id
        let fullName = imgName + path.extname(files.file.name)
        let repath = './public/img/' + fullName
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

  async qiniu (req) {
    return new Promise((resolve, reject) => {
      let form = formidable.IncomingForm()
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
        let imgName =
          (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(
            16
          ) + img_id
        let extname = path.extname(files.file.name)
        let repath = './public/img/' + imgName + extname
        try {
          let key = imgName + extname
          await fs.rename(files.file.path, repath)
          let token = this.uptoken('s-elm', key)
          let uploadToken = await token.uploadToken(mac)
          let qiniuImg = await this.uploadFile(uploadToken, key, repath)
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
    var putPolicy = new qiniu.rs.PutPolicy({ scope: bucket + ':' + key })
    return putPolicy
  }
  uploadFile (uptoken, key, localFile) {
    return new Promise((resolve, reject) => {
      let formUploader = new qiniu.form_up.FormUploader(config)
      let putExtra = new qiniu.form_up.PutExtra()
      formUploader.putFile(uptoken, key, localFile, putExtra, function (err, ret) {
        if (!err) {
          resolve(ret.key)
        } else {
          reject(new Error(err.message || '图片上传至七牛失败'))
        }
      })
    })
  }
}
