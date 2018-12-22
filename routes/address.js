'use strict'

import express from 'express'
import Address from '../controller/address/address'
import Check from '../middlewares/check'

const router = express.Router()

router.post('/addAddress', Check.checkUserLogin, Address.addAddress) // 创建地址
router.get('/getAddressList', Check.checkUserLogin, Address.getAddressList) // 获取地址列表
router.delete('/removeAddress/:id', Check.checkUserLogin, Address.removeAddress) // 删除地址
router.get('/getAddress/:id', Address.getAddress) // 获取地址详情

export default router
