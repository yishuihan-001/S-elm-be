'use strict'

import express from 'express'
import Hongbao from '../controller/hongbao/hongbao'
import Check from '../middlewares/check'

const router = express.Router()

router.get('/getHongbaoUsable', Hongbao.getHongbaoUsable) // 获取可用红包
router.get('/getHongbaoDue', Hongbao.getHongbaoDue) // 获取过期红包
router.post('/exchange', Hongbao.exchange) // 兑换红包

export default router
