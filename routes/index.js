'use strict'

import test from './test'
import city from './city'

export default app => {
  app.use('/test', test)
  app.use('/city', city)
}
