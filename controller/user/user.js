'use strict'

import crypto from 'crypto'
import timestamp from 'time-stamp'
import formidable from 'formidable'
import UserModel from '../../models/user/user'
import UserInfoModel from '../../models/user/userInfo'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class User extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.login = this.login.bind(this)
    this.userInfo = this.userInfo.bind(this)
    this.signout = this.signout.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.changeUsername = this.changeUsername.bind(this)
    this.getUserList = this.getUserList.bind(this)
    this.areaNum = this.areaNum.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 登录
  async login (req, res, next) {
    let cap = +req.cookies.cap
    if (!cap) {
      return res.send(Res.Fail('验证码已失效'))
    }

    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) return res.send(Res.Fail('formidable 初始化失败'))
      let { username, password, verifycode } = fields

      try {
        let va = new Validator()
        va.add(username, [{ rule: 'isEmpty', msg: '用户名不能为空' }])
        va.add(password, [{ rule: 'isEmpty', msg: '密码不能为空' }])
        va.add(verifycode, [{ rule: 'isEmpty', msg: '验证码不能为空' }, { rule: 'equal:' + cap, msg: '验证码有误' }])
        let vaResult = va.start()
        if (vaResult) {
          throw new Error(vaResult)
        }

        let user = await UserModel.findOne({ username }, '-_id')
        if (!user) {
          let user_id = await this.getId('user_id')
          let cityInfo = await this.guessCity(req)
          let registe_time = timestamp('YYYY-MM-DD HH:mm:ss')
          let newUser = { id: user_id, username, password }
          let newUserInfo = { id: user_id, username, password: this.encryption(password), city: cityInfo.city, registe_time }
          let resObj = await UserModel.create(newUser)
          let resObjInfo = await UserInfoModel.create(newUserInfo)
          req.session.user_id = user_id
          res.send(Res.Success(resObjInfo))
        } else if (user.password !== password) {
          throw new Error('密码错误')
        } else {
          let resObjInfo = await UserInfoModel.findOne({ id: user.id }, '-_id -password')
          req.session.user_id = user.id
          res.send(Res.Success(resObjInfo))
        }
      } catch (err) {
        res.send(Res.Fail(err.message || '登录失败'))
      }
    })
  }

  // 获取用户信息
  async userInfo (req, res, next) {
    let user_id = req.session.user_id
    try {
      let resObjInfo = await UserInfoModel.findOne({ id: user_id }, '-_id -password')
      res.send(Res.Success(resObjInfo))
    } catch (err) {
      res.send(Res.Fail(err.message || '通过session获取用户信息失败'))
    }
  }

  // 退出登录
  async signout (req, res, next) {
    delete req.session.user_id
    res.send(Res.Success('退出成功'))
  }

  // 修改密码
  async changePassword (req, res, next) {
    let user_id = req.session.user_id
    let cap = +req.cookies.cap
    if (!cap) {
      return res.send(Res.Fail('验证码已失效'))
    }

    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) return res.send(Res.Fail('formidable 初始化失败'))
      let { oldpassWord, newpassword, confirmpassword, verifycode } = fields

      try {
        let va = new Validator()
        va.add(oldpassWord, [{ rule: 'isEmpty', msg: '原始密码不能为空' }])
        va.add(newpassword, [{ rule: 'isEmpty', msg: '新密码不能为空' }])
        va.add(confirmpassword, [{ rule: 'isEmpty', msg: '确认新密码不能为空' }, { rule: 'equal:' + newpassword, msg: '两次输入的新密码不一致' }])
        va.add(verifycode, [{ rule: 'isEmpty', msg: '验证码不能为空' }, { rule: 'equal:' + cap, msg: '验证码有误' }])
        let vaResult = va.start()
        if (vaResult) {
          throw new Error(vaResult)
        }

        let resObj = await UserModel.findOne({ id: user_id })
        let resObjInfo = await UserInfoModel.findOne({ id: user_id })
        if (!resObj) {
          throw new Error('未找到当前用户')
        } else if (oldpassWord !== resObj.password) {
          throw new Error('输入的原始密码有误')
        } else {
          resObj.password = newpassword
          resObjInfo.password = this.encryption(newpassword)
          resObj.save()
          resObjInfo.save()
          res.send(Res.Success('密码修改成功'))
        }
      } catch (err) {
        res.send(Res.Fail(err.message || '密码修改失败'))
      }
    })
  }

  // 修改用户名
  async changeUsername (req, res, next) {
    let user_id = req.session.user_id
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) return res.send(Res.Fail('formidable 初始化失败'))
      let { username } = fields

      try {
        let va = new Validator()
        va.add(username, [{ rule: 'isEmpty', msg: '用户名不能为空' }, { rule: 'minLength:5', msg: '用户名长度需介于5-24字符之间' }, { rule: 'maxLength:24', msg: '用户名长度需介于5-24字符之间' }])
        let vaResult = va.start()
        if (vaResult) {
          throw new Error(vaResult)
        }

        let resObj = await UserModel.findOne({ id: user_id })
        let resObjInfo = await UserInfoModel.findOne({ id: user_id })
        if (!resObj) {
          throw new Error('未找到当前用户')
        } else {
          resObj.username = username
          resObjInfo.username = username
          resObj.save()
          resObjInfo.save()
          res.send(Res.Success('用户名修改成功'))
        }
      } catch (err) {
        res.send(Res.Fail(err.message || '用户名修改失败'))
      }
    })
  }

  // 获取所有用户
  async getUserList (req, res, next) {
    let { limit = 20, offset = 0 } = req.query
    try {
      let adminList = await UserInfoModel.find({}, '-_id -password').skip(Number(offset)).limit(Number(limit))
      res.send(Res.Success(adminList))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取所有用户失败'))
    }
  }

  // 获取用户分布城市数量
  async areaNum (req, res, next) {
    let cityArr = ['北京', '上海', '西安', '深圳']
    let filterArr = []
    cityArr.forEach(item => {
      filterArr.push(UserInfoModel.find({ city: item }).count())
    })
    filterArr.push(UserInfoModel.$where('!"北京上海西安深圳".includes(this.city)').count())
    Promise.all(filterArr).then(result => {
      res.send(Res.Success({
        beijing: result[0],
        shanghai: result[1],
        shenzhen: result[2],
        hangzhou: result[3],
        qita: result[4]
      }))
    }).catch(err => {
      res.send(Res.Fail(err.message || '获取用户分布城市数据失败'))
    })
  }

  // 密码加密
  encryption (password) {
    let newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password))
    return newpassword
  }
  Md5 (password) {
    let md5 = crypto.createHash('md5')
    return md5.update(password).digest('base64')
  }
}

export default new User()
