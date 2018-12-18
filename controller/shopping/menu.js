'use strict'

import formidable from 'formidable'
import ShopModel from '../../models/shopping/shop'
import MenuModel from '../../models/shopping/menu'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Menu extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.addMenu = this.addMenu.bind(this)
    this.getMenu = this.getMenu.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 添加商品分类
  async addMenu (req, res, next) {
    let menu_id

    try {
      menu_id = await this.getId('menu_id')
    } catch (err) {
      return res.send(Res.Fail(err.message || '分类id获取失败'))
    }

    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) return res.send(Res.Fail('formidable 初始化失败'))
      try {
        let va = new Validator()
        va.add(fields.restaurant_id, [{ rule: 'isEmpty', msg: '商铺id不能为空' }])
        va.add(fields.name, [{ rule: 'isEmpty', msg: '分类名称不能为空' }])
        va.add(fields.is_selected, [{ rule: 'isEmpty', msg: '该分类是否选中不能为空' }])
        let vaResult = va.start()
        if (vaResult) {
          throw new Error(vaResult)
        }

        let shop = await ShopModel.findOne({ id: +fields.restaurant_id })
        if (!shop) {
          throw new Error('该商铺不存在')
        }

        let newMenu = {
          id: menu_id,
          restaurant_id: +fields.restaurant_id,
          name: fields.name,
          is_selected: fields.is_selected,
          description: fields.description || '热销',
          icon_url: fields.icon_url || 'http://f0.jmstatic.com/btstatic/h5/index/bg_logo_1_1.jpg',
          foods: []
        }

        let menuList = await MenuModel.find({})
        if (!menuList.length) {
          newMenu.is_selected = true
        } else if (newMenu.is_selected) {
          menuList.forEach(async item => {
            await MenuModel.findOneAndUpdate({ id: item.id }, { $set: { is_selected: false } })
          })
        }

        await MenuModel.create(newMenu)
        res.send(Res.Success('商品分类添加成功'))
      } catch (err) {
        res.send(Res.Fail(err.message || '添加商品分类失败'))
      }
    })
  }

  // 获取商品分类
  async getMenu (req, res, next) {
    let shopId = req.params.id
    // let all = req.params.all
    if (Ju.isEmpty(shopId)) {
      return res.send(Res.Fail('商铺id不能为空'))
    }

    try {
      let targetShop = await ShopModel.findOne({ id: shopId })
      if (!targetShop) {
        throw new Error('该商铺不存在S')
      }
    } catch (err) {
      return res.send(Res.Fail(err.message || '该商铺不存在'))
    }

    try {
      let filter = { restaurant_id: +shopId }
      // if (+all !== 0) {
      //   filter = { restaurant_id: +shopId }
      // } else {
      //   filter = { restaurant_id: +shopId, $where: function () { return this.foods.length } } // 只获取满足条件的menu
      // }
      let menuList = await MenuModel.find(filter, '-_id')
      res.send(Res.Success(menuList))
    } catch (err) {
      res.send(Res.Fail(err.message || '商铺分类获取失败'))
    }
  }
}

export default new Menu()
