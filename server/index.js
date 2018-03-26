const mongoose = require('mongoose')

const Koa = require('koa')
const { connect, initSchemas, initAdmin } = require('./database/init')

;(async () => {
  await connect()
  initSchemas()
  // require('./tasks/movie')
  // require('./tasks/api')
  // require('./tasks/video')
  // require('./tasks/qiniu')
  // initAdmin()
})()

const app = new Koa()

app.use(async (ctx, next) => {
  ctx.body = 'hello Admin!'
})
app.listen(4000)