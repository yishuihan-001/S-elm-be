'use strict'

import express from 'express'
import Account from '../controller/order/account'
import Order from '../controller/order/order'

const router = express.Router()

router.post('/account/create', Account.create) // 创建结算信息
router.post('/indent/create', Order.create) // 创建订单
router.get('/indent/list', Order.list) // 获取订单列表
router.get('/indent/detail/:id', Order.detail) // 获取订单详情

export default router
