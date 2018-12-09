const BodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')

// POST解析
export const addBodyParser = app => {
  app.use(BodyParser())
}

// 打印请求日志
export const addLogger = app => {
  if (process.env.NODE_ENV !== 'production') {
    app.use(logger())
  }
}


// 设置session
export const addSession = app => {
  app.keys = ['lihaoze']
  const CONF =  {
    key: 'koa:sess',
    maxAge: 86400000,
    httpOnly: false
  }
  app.use(session(CONF, app))
}
