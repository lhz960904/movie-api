const { get, post, put, del, controller, required } = require('../lib/decorator')
const {
  getAllMovies,
  getMovieDetail,
  getRelativeMovies
} = require('../service/movie')

@controller('api/client/movie')
export class movieController {
  @get('/get_all') // 获取符合条件的电影条数
  @required({
    query: ['page_size', 'page']
  })
  async getAll (ctx, next) {
    const { category, page_size, page, type } = ctx.query
    const data = await getAllMovies(category, page_size, page, type)
    ctx.body = {
      code: 0,
      errmsg: '',
      data
    }
  }

  @get('/get_detail/:id') // 通过id获取单条电影信息
  async getDetail (ctx, next) {
    const { id } = ctx.params
    const movie = await getMovieDetail(id)
    ctx.body = {
      code: 0,
      errmsg: '',
      data: {
        movie
      }
    }
  }

  @get('/get_relative/:id') // 通过id获取与该电影相似的条目信息
  async getRelative (ctx, next) {
    const { id } = ctx.params
    const movies = await getRelativeMovies(id)
    ctx.body = {
      code: 0,
      errmsg: '',
      data: {
        movies
      }
    }
  }
}