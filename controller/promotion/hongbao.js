'use strict'

import HongbaoModel from '../../models/promotion/hongbao'
import BaseComponent from '../../prototype/baseComponent'
import Res from '../../lib/res'

class Hongbao extends BaseComponent {
  constructor () {
    super()
    this.getHongbao = this.getHongbao.bind(this)
    this.getExpiredHongbao = this.getExpiredHongbao.bind(this)
  }
  async getHongbao (req, res, next) {
    this.hongbaoHandle(req, res, 'intime')
  }
  async getExpiredHongbao (req, res, next) {
    this.hongbaoHandle(req, res, 'expired')
  }
  async hongbaoHandle (req, res, type) {
    const present_status = type === 'intime' ? 1 : 4
    const user_id = req.params.user_id
    const { limit = 0, offset = 0 } = req.query
    try {
      if (!user_id || !Number(user_id)) {
        throw new Error('user_id参数错误')
      } else if (!Number(limit)) {
        throw new Error('limit参数错误')
      } else if (typeof Number(offset) !== 'number') {
        throw new Error('offset参数错误')
      }
    } catch (err) {
      console.log(err.message, err)
      return res.send(Res.Fail(err.message || '参数错误'))
    }
    try {
      const hongbaos = await HongbaoModel.find({ present_status }, '-_id')
        .limit(Number(limit))
        .skip(Number(offset))
      res.send(Res.Success(hongbaos))
    } catch (err) {
      console.log('获取红包数据失败')
      res.send(Res.Fail(err.message || '获取红包数据失败'))
    }
  }
  async exchange (req, res, next) {
    res.send(Res.Fail('无效的兑换码'))
  }
}

export default new Hongbao()
