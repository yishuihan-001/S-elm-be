'use strict'

import express from 'express'
import Image from '../controller/sundry/image'
import Verify from '../controller/sundry/verify'
import Explain from '../controller/sundry/explain'

const router = express.Router()

router.post('/upload', Image.upload) // 上传图片
router.get('/verify', Verify.getVerifycode) // 获取验证码
router.get('/explainList', Explain.getExplainList) // 获取常见问题
router.get('/explainDetail/:id', Explain.getExplainDetail) // 获取常见问题详情

export default router
