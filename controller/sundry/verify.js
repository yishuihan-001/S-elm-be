'use strict'

import Captchapng from 'captchapng'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Verify extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.getVerifycode = this.getVerifycode.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 获取验证码
  async getVerifycode (req, res, next) {
    let cap = parseInt(Math.random() * 9000 + 1000)
    let c = new Captchapng(80, 30, cap)
    c.color(0, 0, 0, 0)
    c.color(80, 80, 80, 255)
    let img = c.getBase64()

    res.cookie('cap', cap, { maxAge: 300000, httpOnly: true })
    res.send(Res.Success('data:image/png;base64,' + img))

    // let imgbase64 = new Buffer(img, 'base64')
    // res.writeHead(200, {
    //   'Content-Type': 'image/png'
    // })
    // res.send(Res.Success(imgbase64))
  }
}

export default new Verify()
