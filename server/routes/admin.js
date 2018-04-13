const { get, post, put, del, controller, required, auth, admin } = require('../lib/decorator')
const {
  getAllMovies,
  deleteMoive,
  getTypeCount,
  getLineData
} = require('../service/movie')
const {
  getAllUsers,
  deleteUser
} = require('../service/user')
const {
  getMoiveTypes
} = require('../service/category')


@controller('api/admin')
export class adminController {
  @get('/get_all_movies') // 获取符合条件的电影条数
  @auth // 检查是否登录
  @admin('admin') //检查是否是管理员
  async getAllMovies(ctx, next) {
    const data = await getAllMovies()
    ctx.body = {
      code: 0,
      errmsg: '',
      data
    }
  }

  @get('/get_all_users') // 获取所有用户
  @auth // 检查是否登录
  @admin('admin') //检查是否是管理员
  async getAllUsers(ctx, next) {
    const users = await getAllUsers()
    ctx.body = {
      code: 0,
      errmsg: '',
      data: {
        users
      }
    }
  }

  @del('/delete_movie/:id') // 删除某条电影信息
  async delMovie(ctx, next) {
    const { id } = ctx.params
    const bol = await deleteMoive(id)
    if (bol) {
      ctx.body = {
        code: 0,
        errmsg: '删除成功'
      }
    } else {
      ctx.body = {
        code: 1,
        errmsg: '删除失败'
      }
    }
  }

  @del('/delete_user/:id') // 删除某用户信息
  async delUser(ctx, next) {
    const { id } = ctx.params
    const bol = await deleteUser(id)
    if (bol) {
      ctx.body = {
        code: 0,
        errmsg: '删除成功'
      }
    } else {
      ctx.body = {
        code: 1,
        errmsg: '删除失败'
      }
    }
  }

  @get('/get_pie') //根据电影类型划分电影数据
  async getPie(ctx, next) {
    let values = []
    let keys = []
    const data = await getTypeCount()
    ctx.body = {
      code: 0,
      data: {
        keysArr: data.keys,
        valuesArr: data.values
      },
      errmsg: ''
    }
  }

  @get('/get_line') //根据电影上映时间划分电影数据
  async getLine(ctx, next) {
    const data = await getLineData()
    ctx.body = {
      code: 0,
      data,
      errmsg: ''
    }
  }
}