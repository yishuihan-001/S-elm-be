'use strict'

import express from 'express'
import Food from '../controller/shopping/food'

const router = express.Router()

router.get('/test', Food.test) // 测试

export default router
