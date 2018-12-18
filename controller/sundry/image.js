'use strict'

import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

const configLite = require('config-lite')
const config = configLite(__dirname)

class Image extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.upload = this.upload.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 上传图片
  async upload (req, res, next) {
    let prefix
    let imgUrl
    if (process.env.NODE_ENV === 'development') {
      prefix = 'http://localhost:' + config.port + '/assets/img/'
    } else {
      prefix = 'pjchsh1l8.bkt.clouddn.com/'
    }
    try {
      imgUrl = await this.uploadImg(req, res, next)
      res.send(Res.Success(prefix + imgUrl))
    } catch (err) {
      res.send(Res.Fail(err.message || '图片上传失败'))
    }
  }
}

export default new Image()
