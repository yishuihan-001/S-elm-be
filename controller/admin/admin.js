'use strict'

import crypto from 'crypto'
import timestamp from 'time-stamp'
import formidable from 'formidable'
import AdminModel from '../../models/admin/admin'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Admin extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.login = this.login.bind(this)
    this.userInfo = this.userInfo.bind(this)
    this.signout = this.signout.bind(this)
    this.getAdminList = this.getAdminList.bind(this)
    this.getAdminCount = this.getAdminCount.bind(this)
    this.dateAdminRegisteNum = this.dateAdminRegisteNum.bind(this)
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
    // let cap = +req.cookies.cap
    // if (!cap) {
    //   return res.send(Res.Fail('验证码已失效'))
    // }
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) return res.send(Res.Fail('formidable 初始化失败'))
      let { username, password } = fields

      try {
        let va = new Validator()
        va.add(username, [{ rule: 'isEmpty', msg: '用户名不能为空' }])
        va.add(password, [{ rule: 'isEmpty', msg: '密码不能为空' }])
        // va.add(verifycode, [{ rule: 'isEmpty', msg: '验证码不能为空' }, { rule: 'equal:' + cap, msg: '验证码有误' }])
        let vaResult = va.start()
        if (vaResult) {
          throw new Error(vaResult)
        }

        let admin = await AdminModel.findOne({ username }, '-_id').lean()
        if (!admin) {
          let admin_id = await this.getId('admin_id')
          let cityInfo = '北京' // await this.guessCity(req)
          let create_time = timestamp('YYYY-MM-DD HH:mm:ss')
          let newAdmin = { id: admin_id, username, password: this.encryption(password), create_time, type: 'o', city: cityInfo }
          let resObj = await AdminModel.create(newAdmin)
          req.session.admin_id = admin_id
          res.send(Res.Success(resObj))
        } else if (admin.password !== this.encryption(password)) {
          throw new Error('密码错误')
        } else {
          delete admin.password
          req.session.admin_id = admin.id
          res.send(Res.Success(admin))
        }
      } catch (err) {
        res.send(Res.Fail(err.message || '登录失败'))
      }
    })
  }

  // // 获取管理员信息
  async userInfo (req, res, next) {
    let admin_id = req.session.admin_id
    try {
      let resObjInfo = await AdminModel.findOne({ id: admin_id }, '-_id -password')
      res.send(Res.Success(resObjInfo))
    } catch (err) {
      res.send(Res.Fail(err.message || '通过session获取管理员信息失败'))
    }
  }

  // 退出登录
  async signout (req, res, next) {
    delete req.session.admin_id
    res.send(Res.Success('退出成功'))
  }

  // 获取所有管理员
  async getAdminList (req, res, next) {
    let { limit = 20, offset = 0 } = req.query
    try {
      let adminList = await AdminModel.find({}, '-_id -password').skip(Number(offset)).limit(Number(limit))
      res.send(Res.Success(adminList))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取所有管理员失败'))
    }
  }

  // 获取管理员数量
  async getAdminCount (req, res, next) {
    try {
      let count = await AdminModel.count()
      res.send(Res.Success(count))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取所有管理员失败'))
    }
  }

  // 获取某日管理员注册量
  async dateAdminRegisteNum (req, res, next) {
    let date = req.params.date || timestamp('YYYY-MM-DD')
    try {
      let count = await AdminModel.find({ create_time: eval('/^' + date + '/') }).count()
      res.send(Res.Success(count))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取该日管理员注册量失败'))
    }
  }

  // 获取管理员分布城市数量
  async areaNum (req, res, next) {
    let cityArr = ['北京', '上海', '西安', '深圳']
    let filterArr = []
    cityArr.forEach(item => {
      filterArr.push(AdminModel.find({ city: item }).count())
    })
    filterArr.push(AdminModel.$where('!"北京上海西安深圳".includes(this.city)').count())
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

export default new Admin()
