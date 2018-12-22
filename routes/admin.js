'use strict'

import express from 'express'
import Admin from '../controller/admin/admin'
import Check from '../middlewares/check'

const router = express.Router()

router.post('/login', Admin.login) // 登录 没有账号自动创建账号
router.get('/userInfo', Check.checkAdminLogin, Admin.userInfo) // 获取管理员信息
router.get('/signout', Check.checkAdminLogin, Admin.signout) // 退出登录
router.get('/all', Admin.getAdminList) // 获取所有管理员
router.get('/count', Admin.getAdminCount) // 获取管理数量
router.get('/dateRegisteNum/:date', Admin.dateAdminRegisteNum) // 获取某天管理员注册量
router.get('/areaNum', Admin.areaNum) // 获取管理员分布

export default router
