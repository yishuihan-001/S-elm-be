'use strict'

import express from 'express'
import Account from '../controller/order/account'
import Order from '../controller/order/order'

const router = express.Router()

router.post('/account/create', Account.create)
router.post('/indent/create', Order.create)

export default router
