'use strict'

import express from 'express'
import Category from '../controller/shopping/category'
import Delivery from '../controller/shopping/delivery'
import Activity from '../controller/shopping/activity'
import Label from '../controller/shopping/label'
import Remark from '../controller/shopping/remark'
import Food from '../controller/shopping/food'
import Shop from '../controller/shopping/shop'
import Menu from '../controller/shopping/menu'
import Rate from '../controller/shopping/rate'

const router = express.Router()

router.get('/test', Category.test) // 测试

router.get('/category/all', Category.getAllCategory) // 获取所有商品分类
router.get('/delivery/all', Delivery.getAllDelivery) // 获取所有配送方式
router.get('/activity/all', Activity.getAllActivity) // 获取所有商家活动
router.get('/label/all', Label.getAllLabel) // 获取所有商家属性标签
router.get('/remark/all', Remark.getAllRemark) // 获取所有备注标签

router.post('/food/addFood', Food.addFood) // 添加商品
router.post('/food/updateFood', Food.updateFood) // 更新商品
router.delete('/food/deleteFood/:id', Food.deleteFood) // 删除商品
router.get('/food/getList', Food.getList) // 获取商品列表
router.get('/food/count', Food.getCount) // 获取商品数量

router.post('/shop/addShop', Shop.addShop) // 添加商铺
router.post('/shop/updateShop', Shop.updateShop) // 更新商铺
router.delete('/shop/deleteShop/:id', Shop.deleteShop) // 删除商铺
router.get('/shop/search', Shop.searchShop) // 搜索商铺
router.get('/shop/detail/:id', Shop.shopDetail) // 获取商铺详情
router.post('/shop/getList', Shop.getList) // 获取商铺列表
router.get('/shop/count', Shop.getCount) // 获取商铺数量

router.post('/menu/addMenu', Menu.addMenu) // 添加商品分类
router.get('/menu/getMenu/:id', Menu.getMenu) // 获取商品分类

router.get('/rate/getRatings/:id', Rate.getRatings) // 获取评价信息
router.get('/rate/getScores/:id', Rate.getScores) // 获取评价分数
router.get('/rate/getTags/:id', Rate.getTags) // 获取评价标签

export default router
