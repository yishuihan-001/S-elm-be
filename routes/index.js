'use strict'

import test from './test'
import city from './city'
import shopping from './shopping'
import order from './order'
import sundry from './sundry'

export default app => {
  app.use('/test', test)
  app.use('/city', city)
  app.use('/shopping', shopping)
  app.use('/order', order)
  app.use('/sundry', sundry)
}
