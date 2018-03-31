const BodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')

export const addBodyParser = app => {
  app.use(BodyParser())
}

export const addLogger = app => {
  app.use(logger())
}

export const addSession = app => {
  app.keys = ['lihaoze']
  const CONF =  {
    key: 'koa:sess',
    maxAge: 86400000,
    httpOnly: false
  }
  app.use(session(CONF, app))
}
