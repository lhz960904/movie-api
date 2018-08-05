require('babel-core/register')()
require('babel-polyfill')
const Koa = require('koa')
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')
const R = require('ramda')
const MIDDLEWARES = ['common', 'router']

/**
 * 载入各种Koa中间件
 * 将MIDDLEWARES数组遍历执行require引入，执行引入对象的每个中间件
 * @param {Koa实例对象} app 
 */
const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => resolve(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}

;(async () => {
  // 连接数据库
  await connect()
  // 初始化数据Schema
  initSchemas()
  /**
   * 爬取电影数据
   * require('./tasks/movie')
   * require('./tasks/api')
   * require('./tasks/video')
   * require('./tasks/qiniu')
   */
  const app = new Koa()
  // 载入中间件
  await useMiddlewares(app)
  app.listen(4000)
})()
