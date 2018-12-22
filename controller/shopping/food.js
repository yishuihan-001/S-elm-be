'use strict'

import formidable from 'formidable'
import ShopModel from '../../models/shopping/shop'
import MenuModel from '../../models/shopping/menu'
import FoodModel from '../../models/shopping/food'
import AddressComponent from '../../prototype/addressComponent'
import Validator from '../../lib/validator'
import Ju from '../../lib/judge'
import Res from '../../lib/res'

class Food extends AddressComponent {
  constructor () {
    super()
    this.test = this.test.bind(this)
    this.addFood = this.addFood.bind(this)
    this.updateFood = this.updateFood.bind(this)
    this.deleteFood = this.deleteFood.bind(this)
    this.getList = this.getList.bind(this)
    this.getCount = this.getCount.bind(this)
  }

  async test (req, res, next) {
    try {
      res.send(Res.Success('测试'))
    } catch (err) {
      res.send(Res.Fail(err.message || '测试失败'))
    }
  }

  // 添加商品
  async addFood (req, res, next) {
    let food_id

    try {
      food_id = await this.getId('food_id')
    } catch (err) {
      return res.send(Res.Fail(err.message || '商品id创建失败'))
    }

    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) return res.send(Res.Fail('formidable 初始化失败'))

      try {
        let va = new Validator()
        va.add(fields.restaurant_id, [{ rule: 'isEmpty', msg: '商铺id不能为空' }])
        va.add(fields.menu_id, [{ rule: 'isEmpty', msg: '分类id不能为空' }])
        va.add(fields.name, [{ rule: 'isEmpty', msg: '商品名称不能为空' }])
        va.add(fields.image_path, [{ rule: 'isEmpty', msg: '商品图片链接不能为空' }])
        va.add(fields.is_multi, [{ rule: 'isEmpty', msg: '规格类型不能为空' }])
        let vaResult = va.start()
        if (vaResult) {
          throw new Error(vaResult)
        }

        let newFood = {
          id: food_id,
          restaurant_id: +fields.restaurant_id,
          menu_id: +fields.menu_id,
          name: fields.name,
          image_path: fields.image_path,
          is_multi: fields.is_multi,
          description: fields.description || '并没有什么描述',
          attributes: fields.attributes || [],
          activity: fields.activity || [],
          rating: +fields.rating || (Math.random() * 5).toFixed(1),
          rating_count: +fields.rating_count || Math.round(Math.random() * 10),
          month_sales: +fields.month_sales || Math.round(Math.random() * 100),
          single_spec: fields.single_spec || {},
          multi_spec: fields.multi_spec || []
        }

        let targetShop = await ShopModel.findOne({ id: newFood.restaurant_id })
        let targetMenu = await MenuModel.findOne({ id: newFood.menu_id })
        if (!targetShop) {
          throw new Error('该商铺不存在')
        } else if (!targetMenu) {
          throw new Error('该分类不存在')
        } else if (newFood.restaurant_id !== targetMenu.restaurant_id) {
          throw new Error('该商铺下不存在该分类')
        }

        if (newFood.activity.length) {
          newFood.activity.forEach(item => {
            item.id = Math.floor((new Date().getTime() * Math.round(Math.random() * 100 + 1)) / 100000000 / 100)
          })
        }

        let itemId
        if (newFood.is_multi) {
          let tempArr = []
          // method 1 ()
          /* newFood.multi_spec.forEach(async specItem => {
            itemId = await this.getId('item_id')
            console.log(itemId)
            tempArr.push(itemId)
          }) */

          // method 2 （asyncForEach）(https://www.jianshu.com/p/18a6d889769b 改造失败)
          /* this.asyncForEach(newFood.multi_spec, async specItem => {
            itemId = await this.getId('item_id')
            console.log(itemId)
            tempArr.push(itemId)
          }) */

          // method 3 (测试发现也可以使用for-in, 虽然不会method 1 method 2一样并发执行，但取得itemId还是存在相同的)
          /* for (let i of newFood.multi_spec) {
            itemId = await this.getId('item_id')
            console.log(itemId)
            console.log('index: ' + i)
            console.log('value: ' + newFood.multi_spec[i])
            tempArr.push(itemId)
          } */

          itemId = await this.getId('item_id', newFood.multi_spec.length)
          itemId -= newFood.multi_spec.length
          newFood.multi_spec.forEach((specItem, index) => {
            tempArr.push({
              item_id: itemId + index + 1,
              original_price: specItem.original_price,
              current_price: specItem.current_price || specItem.original_price,
              label: specItem.label,
              stock: specItem.stock || Math.round(Math.random() * 100)
            })
          })
          newFood.multi_spec = tempArr
        } else {
          itemId = await this.getId('item_id')
          newFood.single_spec = {
            item_id: itemId,
            original_price: newFood.single_spec.original_price,
            current_price: newFood.single_spec.current_price || newFood.single_spec.original_price,
            stock: newFood.single_spec.stock || Math.round(Math.random() * 100)
          }
        }

        let resObj = await FoodModel.create(newFood)
        targetMenu.foods.push(resObj)
        targetMenu.markModified('foods')
        await targetMenu.save()
        res.send(Res.Success('商品添加成功'))
      } catch (err) {
        res.send(Res.Fail(err.message || '商品创建失败'))
      }
    })
  }

  // 解决异步函数中item_id返回值一致的问题(但是事实并没有解决，还是会遇到forEach一样的问题)
  async asyncForEach (array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

  // 更新商品
  async updateFood (req, res, next) {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) return res.send(Res.Fail('formidable 初始化失败'))
      let { id, name, image_path, new_menu_id } = fields
      try {
        let va = new Validator()
        va.add(id, [{ rule: 'isEmpty', msg: '商品id不能为空' }])
        va.add(name, [{ rule: 'isEmpty', msg: '商品名称不能为空' }])
        va.add(image_path, [{ rule: 'isEmpty', msg: '商品图片链接不能为空' }])
        va.add(new_menu_id, [{ rule: 'isEmpty', msg: '商品当前分类id不能为空' }])
        let vaResult = va.start()
        if (vaResult) {
          throw new Error(vaResult)
        }

        let targetFood = await FoodModel.findOne({ id })
        if (!targetFood) {
          throw new Error('该商品不存在')
        }
        let currMenu = await MenuModel.findOne({ restaurant_id: targetFood.restaurant_id, id: targetFood.menu_id })
        if (!currMenu) {
          throw new Error('当前商品所属分类不存在')
        }

        let targetMenu = await MenuModel.findOne({ restaurant_id: targetFood.restaurant_id, id: new_menu_id })
        if (!targetMenu) {
          throw new Error('menu_id该分类不存在')
        }
        if (currMenu.id === +new_menu_id) {
          let updateData = { id, name, image_path }
          let food = await FoodModel.findOneAndUpdate({ id }, { $set: updateData })
          let subFood = currMenu.foods.id(food._id)
          subFood.set(updateData)
          await currMenu.save()
        } else {
          let updateData = { id, name, image_path, menu_id: new_menu_id }
          let food = await FoodModel.findOneAndUpdate({ id }, { $set: updateData })
          let subFood = currMenu.foods.id(food._id)
          subFood.set(updateData)
          targetMenu.foods.push(subFood)
          await targetMenu.save()
          await subFood.remove()
          await currMenu.save()
        }

        res.send(Res.Success('商品信息修改成功'))
      } catch (err) {
        res.send(Res.Fail(err.message || '更新失败'))
      }
    })
  }

  // 删除商品
  async deleteFood (req, res, next) {
    let food_id = +req.params.id
    if (Ju.isEmpty(food_id)) {
      return res.send(Res.Fail('商品id不能为空'))
    }

    let targetFood = await FoodModel.findOne({ id: food_id })
    if (!targetFood) {
      return res.send(Res.Fail('该商品不存在'))
    }

    try {
      await Promise.all([this.deleteFoodOne(food_id), this.deleteFoodTwo(targetFood._id, targetFood.menu_id)])
      res.send(Res.Success('商品删除成功'))
    } catch (err) {
      res.send(Res.Fail(err.message || '删除商铺失败'))
    }
  }

  async deleteFoodOne (food_id) {
    await FoodModel.remove({ id: food_id })
  }
  async deleteFoodTwo (food_id, menu_id) {
    let belongMenu = await MenuModel.findOne({ id: menu_id })
    let targetFood = belongMenu.foods.id(food_id)
    targetFood.remove()
    belongMenu.save()
  }

  // 获取商品列表
  async getList (req, res, next) {
    let { restaurant_id, offset = 0, limit = 20 } = req.query
    try {
      let va = new Validator()
      va.add(restaurant_id, [{ rule: 'isEmpty', msg: '商铺id不能为空' }])
      va.add(offset, [{ rule: 'isEmpty', msg: 'offset参数错误' }])
      va.add(limit, [{ rule: 'isEmpty', msg: 'limit参数错误' }])
      let vaResult = va.start()
      if (vaResult) {
        throw new Error(vaResult)
      }
      let targetShop = await ShopModel.findOne({ id: restaurant_id })
      if (!targetShop) {
        throw new Error('该商铺不存在')
      }
      let foodList = await FoodModel.find({ restaurant_id }, '-_id').skip(Number(offset)).limit(Number(limit))
      res.send(Res.Success(foodList))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取食品列表失败'))
    }
  }

  // 获取商品数量
  async getCount (req, res, next) {
    let restaurant_id = req.query.id
    let filter = {}
    if (restaurant_id && Number(restaurant_id)) {
      filter = { restaurant_id }
    }
    try {
      let count = await FoodModel.find(filter).count()
      res.send(Res.Success(count))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取食品数量失败'))
    }
  }
}
export default new Food()
