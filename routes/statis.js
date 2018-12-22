'use strict'

import express from 'express'
import Statis from '../controller/statis/statis'

const router = express.Router()

router.get('/api/allAcount', Statis.allApiAcount) // 获取所有api请求量
router.get('/api/dateAcount/:date', Statis.dateApiAcount) // 获取某日api请求量

router.get('/user/allRegisteNum', Statis.allUserRegisteNum) // 获取用户注册总量
router.get('/user/dateRegisteNum/:date', Statis.dateUserRegisteNum) // 获取某日用户注册量

router.get('/order/allNum', Statis.allOrderNum) // 获取订单总量
router.get('/order/dateNum/:date', Statis.dateOrderNum) // 获取某日订单量

export default router
