'use strict'

import mongoose from 'mongoose'
import configLite from 'config-lite'
import chalk from 'chalk'

const config = configLite(__dirname)

mongoose.connect(config.mongodb)
mongoose.Promise = global.Promise

const db = mongoose.connection

db.once('open', () => {
  console.log(chalk.green('Connect database successful: ==>'))
})

db.on('error', function (error) {
  console.error(chalk.red('Error in MongoDb connection: ' + error))
  mongoose.disconnect()
})

db.on('close', function () {
  console.log(chalk.red('数据库断开，重新连接数据库'))
  mongoose.connect(config.mongodb, { server: { auto_reconnect: true } })
})

export default db
