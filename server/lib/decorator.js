const R = require('ramda')
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

  /**
   * 加载所有路由类，遍历Map，取出配置和方法。
   * 拼接请求路径，执行koa-router中间件
   */
  init () {
    glob.sync(resolve(__dirname, this.apiPath, './**/*.js')).forEach(require)
    for (let [conf, controllers] of routerMap) {
      controllers = toArray(controllers)
      let prefixPath = conf.target[symbolPrefix]
      if (prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path
      this.router[conf.method](routerPath, ...controllers)
    }
    this.app.use(this.router.routes()).use(this.router.allowedMethods())
  }
}

// 格式化路径，以“/”开头
export const normalizePath = path => path.startsWith('/') ? path : `/${path}`

// 传入method、path修饰类实例
export const router = conf => (target, key, desc) => {
  conf.path = normalizePath(conf.path)
  routerMap.set({
    target: target,
    ...conf
  },target[key])
}

// 根路径，修饰路由类，将根路径挂载到原型上
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

// 将中间件与类实例方法构成数组，在执行路由的时候，依次执行中间件
const decorate = (args, middleware) => {
  let [target, key, desc] = args
  target[key] = toArray(target[key])
  target[key].unshift(middleware)
  return desc
}

// 传入中间件，配合decorate构成路由中间件数组
const covert = middleware => (...args) => decorate(args, middleware)

// 必须登录查看，否则登录失效
export const auth = covert(async (ctx, next) => {
  if (!ctx.session.user) {
    return (
      ctx.body = {
        code: 1003,
        errmsg: '登录信息失效!'
      }
    )
  }
  await next()
})

// 判断用户身份，传入预期值，如果不匹配则代表无权限
export const admin = roleExpected => covert(async (ctx, next) => {
  const { role } = ctx.session.user
  if (!role || role !== roleExpected) {
    return (
      ctx.body = {
        code: 1004,
        errmsg: '没有权限!'
      }
    )
  }
  await next()
})

// 必传参数、遍历对象，过滤出未传参数
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
        code: 1005,
        errmsg: `${errors.join(',')} is required`
      }
    )
  }
  await next()
})

// 请求成功后返回格式
export const success = (ctx, data) => {
  ctx.body = {
    code: 1001,
    errmsg: '',
    result: data
  }
}

// 请求成功后返回格式
export const error = (ctx, msg) => {
  ctx.body = {
    code: 1002,
    errmsg: msg
  }
}