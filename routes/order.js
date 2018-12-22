'use strict'

import express from 'express'
import Account from '../controller/order/account'
import Order from '../controller/order/order'
import Check from '../middlewares/check'

const router = express.Router()

router.post('/account/create', Check.checkUserLogin, Account.create) // 创建结算信息
router.post('/indent/create', Check.checkUserLogin, Order.create) // 创建订单
router.get('/indent/list', Check.checkUserLogin, Order.list) // 获取用户订单列表
router.get('/indent/detail/:id', Check.checkUserLogin, Order.detail) // 获取订单详情
router.get('/indent/allList', Order.allList) // 获取所有订单列表

export default router
