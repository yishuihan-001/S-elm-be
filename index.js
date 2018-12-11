require('babel-register')

const configLite = require('config-lite')
const config = configLite(__dirname)
const pkg = require('./package')
const app = require('./app.js')

// 监听端口，启动程序
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
})
