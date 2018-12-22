'use strict'

import express from 'express'
import Image from '../controller/sundry/image'
import Verify from '../controller/sundry/verify'
import Explain from '../controller/sundry/explain'

const router = express.Router()

router.post('/upload', Image.upload)
router.get('/verify', Verify.getVerifycode)
router.get('/explain', Explain.getExplain)

export default router
