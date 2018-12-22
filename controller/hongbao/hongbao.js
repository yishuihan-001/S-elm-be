'use strict'

import formidable from 'formidable'
import HongbaoModel from '../../models/hongbao/hongbao'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Verify extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.getHongbaoUsable = this.getHongbaoUsable.bind(this)
    this.getHongbaoDue = this.getHongbaoDue.bind(this)
    this.exchange = this.exchange.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 获取可用红包
  async getHongbaoUsable (req, res, next) {
    this.getHongbao(req, res, next, 'usable')
  }

  // 获取过期红包
  async getHongbaoDue (req, res, next) {
    this.getHongbao(req, res, next, 'due')
  }

  // 获取红包
  async getHongbao (req, res, next, type) {
    type = type || 'usable'
    let present_status = type === 'usable' ? 1 : 4
    let { offset, limit } = req.query

    try {
      let va = new Validator()
      va.add(offset, [{ rule: 'isEmpty', msg: 'offset参数错误' }])
      va.add(limit, [{ rule: 'isEmpty', msg: 'limit参数错误' }])
      let vaResult = va.start()
      if (vaResult) {
        throw new Error(vaResult)
      }

      let hongbaoList = await HongbaoModel.find({ present_status }, '-_id').skip(Number(offset)).limit(Number(limit))
      res.send(Res.Success(hongbaoList))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取红包失败'))
    }
  }

  // 兑换红包
  async exchange (req, res, next) {
    let cap = +req.cookies.cap
    if (!cap) {
      return res.send(Res.Fail('验证码已失效'))
    }

    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) return res.send(Res.Fail('formidable 初始化失败'))
      let { exchange_code, verifycode } = fields

      try {
        let va = new Validator()
        va.add(exchange_code, [{ rule: 'isEmpty', msg: '兑换码不能为空' }])
        va.add(verifycode, [{ rule: 'isEmpty', msg: '验证码不能为空' }, { rule: 'equal:' + cap, msg: '验证码有误' }])
        let vaResult = va.start()
        if (vaResult) {
          throw new Error(vaResult)
        }
        throw new Error('无效的兑换码')
      } catch (err) {
        res.send(Res.Fail(err.message || '兑换失败'))
      }
    })
  }
}

export default new Verify()
