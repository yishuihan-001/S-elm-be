import express from 'express'
import mongodb from './mongodb'
import path from 'path'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import connectMongo from 'connect-mongo'
import configLite from 'config-lite'
import routes from './routes'
import pkg from './package'
// import winston from 'winston'
// import expressWinston from 'express-winston'
import Statistic from './middlewares/statistic'
import ejs from 'ejs'
import mime from 'mime'

const app = express()

// 设置模板目录
app.set('views', path.join(__dirname, 'public'))
// 设置模板引擎为 html
app.engine('.html', ejs.__express)
app.set('view engine', 'html')

app.get('/', function (req, res) {
  // res.sendFile(path.join(__dirname, 'public/index.html'))
  // res.render('index', {title: 'res vs app render'}) <%= title %>
  res.render('index')
})

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*') // 支持跨域调用
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept')// 允许支持跨域的自定义header字段
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS') // 实际请求中允许携带的首部字段
  res.header('Access-Control-Allow-Credentials', true) // 可以带cookies
  if (req.url.match(/assets/)) {
    res.header('Content-Type', mime.getType(req.url))
  } else {
    res.header('Content-Type', 'application/json;charset=utf-8')
  }
  res.header('X-Powered-By', '3.2.1')
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})

// 设置静态文件目录
app.use('/assets', express.static(path.join(__dirname, 'public')))

app.use(cookieParser())
app.use(Statistic.apiRecord)

const MongoStore = connectMongo(session)
const config = configLite(__dirname)

// session 中间件
app.use(
  session({
    name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true, // 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: config.session.cookie, // cookie相关设置
    store: new MongoStore({
      // 将 session 存储到 mongodb
      url: config.mongodb // mongodb 地址
    })
  })
)

// // 处理表单及文件上传的中间件
// app.use(require('express-formidable')({
//   uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
//   keepExtensions: true// 保留后缀
// }))

// 正常请求的日志
// app.use(expressWinston.logger({
//   transports: [
//     new (winston.transports.Console)({
//       json: true,
//       colorize: true
//     }),
//     new winston.transports.File({
//       filename: 'logs/success.log'
//     })
//   ]
// }))
// 路由
routes(app)
// 错误请求的日志
// app.use(expressWinston.errorLogger({
//   transports: [
//     new winston.transports.Console({
//       json: true,
//       colorize: true
//     }),
//     new winston.transports.File({
//       filename: 'logs/error.log'
//     })
//   ]
// }))

// 单元测试时，需要导出app
if (module.parent) {
  // 被 require，则导出 app
  module.exports = app
} else {
  // 监听端口，启动程序
  app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`)
  })
}
