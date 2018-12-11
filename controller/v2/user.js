'use strict'

import AddressComponent from '../../prototype/addressComponent'
import formidable from 'formidable'
import UserInfoModel from '../../models/v2/userInfo'
import UserModel from '../../models/v2/user'
import crypto from 'crypto'
import dtime from 'time-stamp'
import Res from '../../lib/res'

class User extends AddressComponent {
  constructor () {
    super()
    this.login = this.login.bind(this)
    this.encryption = this.encryption.bind(this)
    this.chanegPassword = this.chanegPassword.bind(this)
    this.updateAvatar = this.updateAvatar.bind(this)
  }
  async login (req, res, next) {
    const cap = req.cookies.cap
    if (!cap) {
      console.log('验证码失效')
      return res.send(Res.Fail('验证码失效'))
    }
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) throw err
      const { username, password, captcha_code } = fields
      try {
        if (!username) {
          throw new Error('用户名参数错误')
        } else if (!password) {
          throw new Error('密码参数错误')
        } else if (!captcha_code) {
          throw new Error('验证码参数错误')
        }
      } catch (err) {
        console.log('登陆参数错误', err)
        return res.send(Res.Fail(err.message || '输入信息有误'))
      }
      if (cap.toString() !== captcha_code.toString()) {
        return res.send(Res.Fail('验证码不正确'))
      }
      const newpassword = this.encryption(password)
      try {
        const user = await UserModel.findOne({ username })
        // 创建一个新的用户
        if (!user) {
          const user_id = await this.getId('user_id')
          const cityInfo = await this.guessPosition(req)
          const registe_time = dtime('YYYY-MM-DD HH:mm')
          const newUser = { username, password: newpassword, user_id }
          const newUserInfo = {
            username,
            user_id,
            id: user_id,
            city: cityInfo.city,
            registe_time
          }
          UserModel.create(newUser)
          const createUser = new UserInfoModel(newUserInfo)
          const userinfo = await createUser.save()
          req.session.user_id = user_id
          res.send(Res.Success(userinfo))
        } else if (user.password.toString() !== newpassword.toString()) {
          console.log('用户登录密码错误')
          return res.send(Res.Fail('密码错误'))
        } else {
          req.session.user_id = user.user_id
          const userinfo = await UserInfoModel.findOne(
            { user_id: user.user_id },
            '-_id'
          )
          res.send(Res.Success(userinfo))
        }
      } catch (err) {
        console.log('用户登陆失败', err)
        res.send(Res.Fail(err.message || '登陆失败'))
      }
    })
  }
  async getInfo (req, res, next) {
    const sid = req.session.user_id
    const qid = req.query.user_id
    const user_id = sid || qid
    if (!user_id || !Number(user_id)) {
      console.log('获取用户信息的参数user_id无效', user_id)
      res.send(Res.Fail('通过session获取用户信息失败'))
      return
    }
    try {
      const userinfo = await UserInfoModel.findOne({ user_id }, '-_id')
      res.send(Res.Success(userinfo))
    } catch (err) {
      console.log('通过session获取用户信息失败', err)
      res.send(Res.Fail(err.message || '通过session获取用户信息失败'))
    }
  }
  async getInfoById (req, res, next) {
    const user_id = req.params.user_id
    if (!user_id || !Number(user_id)) {
      console.log('通过ID获取用户信息失败')
      res.send(Res.Fail('通过用户ID获取用户信息失败'))
      return
    }
    try {
      const userinfo = await UserInfoModel.findOne({ user_id }, '-_id')
      res.send(Res.Success(userinfo))
    } catch (err) {
      console.log('通过用户ID获取用户信息失败', err)
      res.send(Res.Fail(err.message || '通过用户ID获取用户信息失败'))
    }
  }
  async signout (req, res, next) {
    delete req.session.user_id
    res.send(Res.Success('退出成功'))
  }
  async chanegPassword (req, res, next) {
    const cap = req.cookies.cap
    if (!cap) {
      console.log('验证码失效')
      return res.send(Res.Fail('验证码失效'))
    }
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) throw err
      const {
        username,
        oldpassWord,
        newpassword,
        confirmpassword,
        captcha_code
      } = fields
      try {
        if (!username) {
          throw new Error('用户名参数错误')
        } else if (!oldpassWord) {
          throw new Error('必须添加旧密码')
        } else if (!newpassword) {
          throw new Error('必须填写新密码')
        } else if (!confirmpassword) {
          throw new Error('必须填写确认密码')
        } else if (newpassword !== confirmpassword) {
          throw new Error('两次密码不一致')
        } else if (!captcha_code) {
          throw new Error('请填写验证码')
        }
      } catch (err) {
        console.log('修改密码参数错误', err)
        return res.send(Res.Fail(err.message || '输入信息有误'))
      }
      if (cap.toString() !== captcha_code.toString()) {
        return res.send(Res.Fail('验证码不正确'))
      }
      const md5password = this.encryption(oldpassWord)
      try {
        const user = await UserModel.findOne({ username })
        if (!user) {
          res.send(Res.Fail('未找到当前用户'))
        } else if (user.password.toString() !== md5password.toString()) {
          res.send(Res.Fail('密码不正确'))
        } else {
          user.password = this.encryption(newpassword)
          user.save()
          res.send(Res.Success('密码修改成功'))
        }
      } catch (err) {
        console.log('修改密码失败', err)
        res.send(Res.Fail(err.message || '修改密码失败'))
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
  async getUserList (req, res, next) {
    const { limit = 20, offset = 0 } = req.query
    try {
      const users = await UserInfoModel.find({}, '-_id')
        .sort({ user_id: -1 })
        .limit(Number(limit))
        .skip(Number(offset))
      res.send(Res.Success(users))
    } catch (err) {
      console.log('获取用户列表数据失败', err)
      res.send(Res.Fail(err.message || '获取用户列表数据失败'))
    }
  }
  async getUserCount (req, res, next) {
    try {
      const count = await UserInfoModel.count()
      res.send(Res.Success(count))
    } catch (err) {
      console.log('获取用户数量失败', err)
      res.send(Res.Fail(err.message || '获取用户数量失败'))
    }
  }
  async updateAvatar (req, res, next) {
    const sid = req.session.user_id
    const pid = req.params.user_id
    const user_id = sid || pid
    if (!user_id || !Number(user_id)) {
      console.log('更新头像，user_id错误', user_id)
      res.send(Res.Fail('user_id参数错误'))
      return
    }

    try {
      const image_path = await this.getPath(req)
      await UserInfoModel.findOneAndUpdate(
        { user_id },
        { $set: { avatar: image_path } }
      )
      res.send(Res.Success(image_path))
    } catch (err) {
      console.log('上传图片失败', err)
      res.send(Res.Fail(err.message || '上传图片失败'))
    }
  }
  async getUserCity (req, res, next) {
    const cityArr = ['北京', '上海', '深圳', '杭州']
    const filterArr = []
    cityArr.forEach(item => {
      filterArr.push(UserInfoModel.find({ city: item }).count())
    })
    filterArr.push(
      UserInfoModel.$where('!"北京上海深圳杭州".includes(this.city)').count()
    )
    Promise.all(filterArr)
      .then(result => {
        let user_city = {
          beijing: result[0],
          shanghai: result[1],
          shenzhen: result[2],
          hangzhou: result[3],
          qita: result[4]
        }
        res.send(Res.Success(user_city))
      })
      .catch(err => {
        console.log('获取用户分布城市数据失败', err)
        res.send(Res.Fail(err.message || '获取用户分布城市数据失败'))
      })
  }
}

export default new User()
