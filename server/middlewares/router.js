const { resolve } = require('path')
const { Route } = require('../lib/decorator')

/**
 * 实例化Route类，增加路由中间件
 * @param {Object} app Koa实例
 */
export const router = app => {
  const apiPath = resolve(__dirname, '../routes')
  const router = new Route(app, apiPath)
  router.init()
}