'use strict'

import AdminModel from '../models/admin/admin'
import Res from '../lib/res'

class Check {
  async checkAdmin (req, res, next) {
    const admin_id = req.session.admin_id
    if (!admin_id || !Number(admin_id)) {
      return res.send(Res.Fail('亲，您还没有登录'))
    } else {
      const admin = await AdminModel.findOne({ id: admin_id })
      if (!admin) {
        return res.send(Res.Fail('亲，您还不是管理员'))
      }
    }
    next()
  }
  async checkSuperAdmin (req, res, next) {
    const admin_id = req.session.admin_id
    if (!admin_id || !Number(admin_id)) {
      return res.send(Res.Fail('亲，您还没有登录'))
    } else {
      const admin = await AdminModel.findOne({ id: admin_id })
      if (!admin || admin.status !== 2) {
        return res.send(Res.Fail('亲，您的权限不足'))
      }
    }
    next()
  }
}

export default new Check()
