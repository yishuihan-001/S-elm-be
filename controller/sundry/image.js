'use strict'

import UserModel from '../../models/user/user'
import AdminModel from '../../models/admin/admin'
import ImageModel from '../../models/image/image'
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
    let user_id = req.session.user_id
    let admin_id = req.session.admin_id
    if (Ju.isEmpty(user_id) && Ju.isEmpty(admin_id)) {
      return res.send(Res.Fail('您还没有登录哦'))
    }

    let fields = {}
    if (user_id) {
      fields = { user_id }
      let UserInfo = await UserModel.findOne({ id: user_id })
      if (!UserInfo) {
        return res.send(Res.Fail('该用户不存在'))
      }
    } else if (admin_id) {
      fields = { admin_id }
      let AdminInfo = await AdminModel.findOne({ id: admin_id })
      if (!AdminInfo) {
        return res.send(Res.Fail('该管理员不存在'))
      }
    }

    let prefix
    let imgUrl
    if (process.env.NODE_ENV === 'development') {
      prefix = 'http://localhost:' + config.port + '/assets/img/'
    } else {
      prefix = 'pjchsh1l8.bkt.clouddn.com/'
    }
    try {
      let perimg_id = await this.getId('perimg_id')
      imgUrl = await this.uploadImg(req, res, next)
      let newAvatar = Object.assign({ id: perimg_id }, fields, { name: imgUrl })
      await ImageModel.create(newAvatar)
      res.send(Res.Success(prefix + imgUrl))
    } catch (err) {
      res.send(Res.Fail(err.message || '图片上传失败'))
    }
  }
}

export default new Image()
