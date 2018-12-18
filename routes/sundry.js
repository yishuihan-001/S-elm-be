'use strict'

import express from 'express'
import Image from '../controller/sundry/image'

const router = express.Router()

router.post('/image/upload', Image.upload)

export default router
