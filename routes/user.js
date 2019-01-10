'use strict'

import express from 'express'
import User from '../controller/user/user'
import Check from '../middlewares/check'

const router = express.Router()

router.post('/login', User.login) // 登录 没有账号自动创建账号
router.get('/userInfo', Check.checkUserLogin, User.userInfo) // 获取用户信息
router.get('/signout', Check.checkUserLogin, User.signout) // 退出登录
router.post('/changePassword', Check.checkUserLogin, User.changePassword) // 修改密码
router.post('/changeUsername', Check.checkUserLogin, User.changeUsername) // 修改用户名
router.get('/all', User.getUserList) // 获取所有用户
router.get('/areaNum', User.areaNum) // 获取用户分布

export default router
