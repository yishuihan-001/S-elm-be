'use strict'

import test from './test'
import city from './city'
import shopping from './shopping'
import sundry from './sundry'

export default app => {
  app.use('/test', test)
  app.use('/city', city)
  app.use('/shopping', shopping)
  app.use('/sundry', sundry)
}
