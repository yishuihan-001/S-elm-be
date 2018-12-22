'use strict'

import test from './test'
import city from './city'
import shopping from './shopping'
import order from './order'
import user from './user'
import address from './address'
import hongbao from './hongbao'
import admin from './admin'
import statis from './statis'
import sundry from './sundry'

export default app => {
  app.use('/test', test)
  app.use('/city', city)
  app.use('/shopping', shopping)
  app.use('/order', order)
  app.use('/user', user)
  app.use('/address', address)
  app.use('/hongbao', hongbao)
  app.use('/admin', admin)
  app.use('/statis', statis)
  app.use('/sundry', sundry)
}
