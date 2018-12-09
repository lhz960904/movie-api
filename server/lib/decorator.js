const R = require('ramda')
// const _ = require('lodash')
const glob = require('glob')
const { resolve } = require('path')
const Router = require('koa-router')
const symbolPrefix = Symbol('prefix')
const routerMap = new Map()
const toArray = c => Array.isArray(c) ? c : [c]

export class Route {
  constructor (app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new Router()
  }

  init () {
    glob.sync(resolve(__dirname, this.apiPath, './**/*.js')).forEach(require)
    for (let [conf, controllers] of routerMap) {
      controllers = toArray(controllers)
      const prefixPath = conf.target[symbolPrefix]
      if (prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path
      this.router[conf.method](routerPath, ...controllers)
    }
    this.app.use(this.router.routes()).use(this.router.allowedMethods())
  }
}

// 格式化路径，以“/”开头
export const normalizePath = path => path.startsWith('/') ? path : `/${path}`

// 
export const router = conf => (target, key, desc) => {
  conf.path = normalizePath(conf.path)
  routerMap.set({
    target: target,
    ...conf
  },target[key])
}

export const controller = path => target => (target.prototype[symbolPrefix] = path)

export const get = path => router({
  method: 'get',
  path: path
})

export const post = path => router({
  method: 'post',
  path: path
})

export const put = path => router({
  method: 'put',
  path: path
})

export const del = path => router({
  method: 'delete',
  path: path
})

export const use = path => router({
  method: 'use',
  path: path
})

export const all = path => router({
  method: 'all',
  path: path
})

const decorate = (args, middleware) => {
  let [target, key, desc] = args
  target[key] = toArray(target[key])
  target[key].unshift(middleware)
  return desc
}

const covert = middleware => (...args) => decorate(args, middleware)

export const auth = covert(async (ctx, next) => {
  if (!ctx.session.user) {
    return (
      ctx.body = {
        code: 401,
        errmsg: '登录信息失效!'
      }
    )
  }
  await next()
})

export const admin = roleExpected => covert(async (ctx, next) => {
  const { role } = ctx.session.user
  if (!role || role !== roleExpected) {
    return (
      ctx.body = {
        code: 403,
        errmsg: '没有权限!'
      }
    )
  }
  await next()
})

export const required = rules => covert(async (ctx, next) => {
  let errors = []
  const checkRules = R.forEachObjIndexed(
    (val, key) => {
      errors = R.filter(i => {
        const obj = ctx.request[key] || ctx[key]
        return !R.has(i)(obj)
      })(val)
    }
  )
  checkRules(rules)
  if (errors.length) {
    return(
      ctx.body = {
        code: 412,
        errmsg: `${errors.join(',')} is required`
      }
    )
  }
  await next()
})
