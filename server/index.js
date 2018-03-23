const Koa = require('koa')

const app = new Koa()

app.use(async (ctx, next) => {
  ctx.body = 'hello Admin!'
})
app.listen(4000)