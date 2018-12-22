'use strict'

import formidable from 'formidable'
import AddressModel from '../../models/address/address'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Address extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.addAddress = this.addAddress.bind(this)
    this.getAddressList = this.getAddressList.bind(this)
    this.removeAddress = this.removeAddress.bind(this)
    this.getAddress = this.getAddress.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 添加收获地址
  async addAddress (req, res, next) {
    let user_id = req.session.user_id
    let address_id

    try {
      address_id = await this.getId('address_id')
    } catch (err) {
      return res.send(Res.Fail(err.message || '获取address_id失败'))
    }

    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) return res.send(Res.Fail('formidable 初始化失败'))
      let { address, address_detail, name, phone, sex = 'privary', tag = '家', lat, lng, is_default = false } = fields

      try {
        let va = new Validator()
        va.add(address, [{ rule: 'isEmpty', msg: '地址不能为空' }])
        va.add(address_detail, [{ rule: 'isEmpty', msg: '详细地址不能为空' }])
        va.add(name, [{ rule: 'isEmpty', msg: '收货人姓名不能为空' }])
        va.add(phone, [{ rule: 'isEmpty', msg: '收货人电话不能为空' }])
        let vaResult = va.start()
        if (vaResult) {
          throw new Error(vaResult)
        }

        let newAddress = {
          id: address_id,
          user_id,
          address,
          address_detail,
          name,
          phone,
          sex,
          tag,
          lat,
          lng,
          is_default
        }
        let addressList = await AddressModel.find({})
        if (!addressList.length) {
          newAddress.is_default = true
        } else if (newAddress.is_default) {
          addressList.forEach(item => {
            AddressModel.findOneAndUpdate({ id: item.id }, { $set: { is_default: false } })
          })
        }
        await AddressModel.create(newAddress)
        res.send(Res.Success('收货地址添加成功'))
      } catch (err) {
        res.send(Res.Fail(err.message || '添加地址失败'))
      }
    })
  }

  // 获取收货地址列表
  async getAddressList (req, res, next) {
    let user_id = req.session.user_id
    try {
      let addressList = await AddressModel.find({ user_id }, '-_id')
      res.send(Res.Success(addressList))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取收货地址失败'))
    }
  }

  // 删除地址
  async removeAddress (req, res, next) {
    let user_id = req.session.user_id
    let addressId = req.params.id
    if (Ju.isEmpty(addressId)) {
      return res.send(Res.Fail('请输入要地址id'))
    }
    try {
      let addressInfo = await AddressModel.findOneAndRemove({ user_id, id: addressId })
      if (!addressInfo) {
        throw new Error('该地址不存在')
      }
      res.send(Res.Success('删除成功'))
    } catch (err) {
      res.send(Res.Fail(err.message || '删除地址失败'))
    }
  }

  // 获取地址详情
  async getAddress (req, res, next) {
    let addressId = req.params.id
    if (Ju.isEmpty(addressId)) {
      return res.send(Res.Fail('请输入要地址id'))
    }
    try {
      let addressInfo = await AddressModel.findOne({ id: addressId })
      if (!addressInfo) {
        throw new Error('该地址不存在')
      }
      res.send(Res.Success(addressInfo))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取地址失败'))
    }
  }
}

export default new Address()
