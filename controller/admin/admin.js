'use strict'

import AdminModel from '../../models/admin/admin'
import AddressComponent from '../../prototype/addressComponent'
import crypto from 'crypto'
import formidable from 'formidable'
import dtime from 'time-stamp'
import Res from '../../lib/res'

class Admin extends AddressComponent {
  constructor () {
    super()
    this.login = this.login.bind(this)
    this.register = this.register.bind(this)
    this.encryption = this.encryption.bind(this)
    this.updateAvatar = this.updateAvatar.bind(this)
  }
  async login (req, res, next) {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send(Res.Fail(err.message || '表单信息错误'))
      }
      const { user_name, password, status = 1 } = fields
      try {
        if (!user_name) {
          throw new Error('用户名参数错误')
        } else if (!password) {
          throw new Error('密码参数错误')
        }
      } catch (err) {
        console.log(err.message, err)
        return res.send(Res.Fail(err.message || '用户名或密码错误'))
      }
      const newpassword = this.encryption(password)
      try {
        const admin = await AdminModel.findOne({ user_name })
        if (!admin) {
          const adminTip = status === 1 ? '管理员' : '超级管理员'
          const admin_id = await this.getId('admin_id')
          const cityInfo = await this.guessPosition(req)
          const newAdmin = {
            user_name,
            password: newpassword,
            id: admin_id,
            create_time: dtime('YYYY-MM-DD HH:mm'),
            admin: adminTip,
            status,
            city: cityInfo.city
          }
          await AdminModel.create(newAdmin)
          req.session.admin_id = admin_id
          res.send(Res.Success('注册管理员成功'))
        } else if (newpassword.toString() !== admin.password.toString()) {
          console.log('管理员登录密码错误')
          res.send(Res.Fail('该用户已存在，密码输入错误'))
        } else {
          req.session.admin_id = admin.id
          res.send(Res.Success('登录成功'))
        }
      } catch (err) {
        console.log('登录管理员失败', err)
        res.send(Res.Fail(err.message || '登录管理员失败'))
      }
    })
  }
  async register (req, res, next) {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send(Res.Fail(err.message || '表单信息错误'))
      }
      const { user_name, password, status = 1 } = fields
      try {
        if (!user_name) {
          throw new Error('用户名错误')
        } else if (!password) {
          throw new Error('密码错误')
        }
      } catch (err) {
        console.log(err.message, err)
        return res.send(Res.Fail(err.message || '输入信息有误'))
      }
      try {
        const admin = await AdminModel.findOne({ user_name })
        if (admin) {
          console.log('该用户已经存在')
          res.send(Res.Fail('该用户已经存在'))
        } else {
          const adminTip = status === 1 ? '管理员' : '超级管理员'
          const admin_id = await this.getId('admin_id')
          const newpassword = this.encryption(password)
          const newAdmin = {
            user_name,
            password: newpassword,
            id: admin_id,
            create_time: dtime('YYYY-MM-DD'),
            admin: adminTip,
            status
          }
          await AdminModel.create(newAdmin)
          req.session.admin_id = admin_id
          res.send(Res.Success('注册管理员成功'))
        }
      } catch (err) {
        console.log('注册管理员失败', err)
        res.send(Res.Fail(err.message || '注册管理员失败'))
      }
    })
  }
  encryption (password) {
    const newpassword = this.Md5(
      this.Md5(password).substr(2, 7) + this.Md5(password)
    )
    return newpassword
  }
  Md5 (password) {
    const md5 = crypto.createHash('md5')
    return md5.update(password).digest('base64')
  }
  async singout (req, res, next) {
    try {
      delete req.session.admin_id
      res.send(Res.Success('退出成功'))
    } catch (err) {
      console.log('退出失败', err)
      res.send(Res.Fail(err.message || '退出失败'))
    }
  }
  async getAllAdmin (req, res, next) {
    const { limit = 20, offset = 0 } = req.query
    try {
      const allAdmin = await AdminModel.find({}, '-_id -password')
        .sort({ id: -1 })
        .skip(Number(offset))
        .limit(Number(limit))
      res.send(Res.Success(allAdmin))
    } catch (err) {
      console.log('获取超级管理列表失败', err)
      res.send(Res.Fail(err.message || '获取超级管理列表失败'))
    }
  }
  async getAdminCount (req, res, next) {
    try {
      const count = await AdminModel.count()
      res.send(Res.Success(count))
    } catch (err) {
      console.log('获取管理员数量失败', err)
      res.send(Res.Fail(err.message || '获取管理员数量失败'))
    }
  }
  async getAdminInfo (req, res, next) {
    const admin_id = req.session.admin_id
    if (!admin_id || !Number(admin_id)) {
      console.log('获取管理员信息的session失效')
      return res.send(Res.Fail('获取管理员信息失败'))
    }
    try {
      const info = await AdminModel.findOne(
        { id: admin_id },
        '-_id -__v -password'
      )
      if (!info) {
        throw new Error('未找到当前管理员')
      } else {
        res.send(Res.Success(info))
      }
    } catch (err) {
      console.log('获取管理员信息失败')
      res.send(Res.Fail(err.message || '获取管理员信息失败'))
    }
  }
  async updateAvatar (req, res, next) {
    const admin_id = req.params.admin_id
    if (!admin_id || !Number(admin_id)) {
      console.log('admin_id参数错误', admin_id)
      return res.send(Res.Fail('admin_id参数错误'))
    }

    try {
      const image_path = await this.getPath(req)
      await AdminModel.findOneAndUpdate(
        { id: admin_id },
        { $set: { avatar: image_path } }
      )
      res.send(Res.Success(image_path))
      return
    } catch (err) {
      console.log('上传图片失败', err)
      res.send(Res.Fail(err.message || '上传图片失败'))
    }
  }
}

export default new Admin()
