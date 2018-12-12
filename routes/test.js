'use strict'

import express from 'express'
import Test from '../controller/test/test'

const router = express.Router()

router.get('/', Test.default)
router.get('/one', Test.one)
router.get('/testGetId/:name', Test.testGetId) // 获取id
router.post('/testUploadImg', Test.testUploadImg) // 上传本地图片
router.get('/testGuessCity', Test.testGuessCity) // 定位城市
router.get('/testSearchPlace', Test.testSearchPlace) // 搜索地址
router.get('/testGetDistance', Test.testGetDistance) // 测距
router.get('/testGuessAddress', Test.testGuessAddress) // 定位地址
router.get('/testGetAddressByGeo/:lat/:lng', Test.testGetAddressByGeo) // 经纬度定位

export default router
