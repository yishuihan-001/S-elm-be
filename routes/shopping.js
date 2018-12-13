'use strict'

import express from 'express'
import Category from '../controller/shopping/category'
import Food from '../controller/shopping/food'
import Shop from '../controller/shopping/shop'

const router = express.Router()

router.get('/test', Category.test) // 测试
router.get('/category/all', Category.getAllCategory) // 获取所有食品分类
router.get('/food/test', Food.test) // 测试
router.get('/shop/test', Shop.test) // 测试
router.post('/shop/addShop', Shop.addShop) // 添加商铺

export default router
