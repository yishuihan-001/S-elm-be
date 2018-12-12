'use strict'

import express from 'express'
import City from '../controller/city/city'

const router = express.Router()

router.get('/test', City.getCityName) // 测试
router.get('/target', City.target) // 获取当前城市，城市列表，热门城市
router.get('/getCityById/:id', City.getCityById) // 获取当前城市，城市列表，热门城市
router.get('/search', City.search) // 搜索地址
router.get('/getPosiByGeo', City.getPosiByGeo) // 根据经纬度获取地址信息

export default router
