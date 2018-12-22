import timestamp from 'time-stamp'
import BaseComponent from '../prototype/baseComponent'
import Ju from '../lib/judge'
import Res from '../lib/res'

class Check extends BaseComponent {
  constructor () {
    super()
    this.checkUserLogin = this.checkUserLogin.bind(this)
    this.checkUserNotLogin = this.checkUserNotLogin.bind(this)
    this.checkAdminLogin = this.checkAdminLogin.bind(this)
    this.checkAdminNotLogin = this.checkAdminNotLogin.bind(this)
  }

  // 用户已登录
  async checkUserLogin (req, res, next) {
    let user_id = req.session.user_id
    if (Ju.isEmpty(user_id)) {
      return res.send(Res.Fail('您还没有登录哦'))
    }
    next()
  }

  // 用户未登录
  async checkUserNotLogin (req, res, next) {
    let user_id = req.session.user_id
    if (Ju.isEmpty(user_id)) {
      next()
    }
    res.send(Res.Fail('您退出登录才能操作哦'))
  }

  // 管理员已登录
  async checkAdminLogin (req, res, next) {
    let admin_id = req.session.admin_id
    if (Ju.isEmpty(admin_id)) {
      return res.send(Res.Fail('您还没有登录哦'))
    }
    next()
  }

  // 管理员未登录
  async checkAdminNotLogin (req, res, next) {
    let admin_id = req.session.admin_id
    if (Ju.isEmpty(admin_id)) {
      next()
    }
    res.send(Res.Fail('您退出登录才能操作哦'))
  }
}

export default new Check()
