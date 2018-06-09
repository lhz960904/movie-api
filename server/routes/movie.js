const { get, post, put, del, controller, required } = require('../lib/decorator')
const {
  getAllMovies,
  getMovieDetail,
  getRelativeMovies,
  searchMovie,
  delMovieTypes,
  getHotKey,
  getSpecialMovies,
  getCategorys
} = require('../service/movie')

@controller('api/client/movie')
export class movieController {
  @get('/get_all') // 获取符合条件的电影条数
  @required({
    query: ['page_size', 'page']
  })
  async getAll (ctx, next) {
    const { page_size, page, type } = ctx.query
    const data = await getAllMovies(page_size, page, type)
    ctx.body = {
      code: 0,
      errmsg: '',
      data
    }
  }

  @get('/get_special')
  async getSpecial (ctx) {
    const movies = await getSpecialMovies(ctx.query)
    ctx.body = {
        code: 0,
        errmsg: '',
        data: {movies}
      }
  }
  @get('/get_detail/:id') // 通过id获取单条电影信息
  async getDetail (ctx, next) {
    const { id } = ctx.params
    const movie = await getMovieDetail(id)
    if (!movie) {
      ctx.body = {
        code: 3,
        errmsg: '',
        data: {}
      }
    } else {
      ctx.body = {
        code: 0,
        errmsg: '',
        data: {
          movie
        }
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

  @get('/search') // 搜索电影
  @required({
    query: ['q']
  })
  async searchMovie(ctx, next) {
    const { q } = ctx.query
    const movies = await searchMovie(q)
    ctx.body = {
      code: 0,
      errmsg: '',
      data: {
        movies
      }
    }
  }

  @get('/deltypes') // 删除电影类型
  async delType(ctx, next) {
    const res = await delMovieTypes()
    if (res) {
      ctx.body = {
        code: 0
      }
    } else {
      ctx.body = {
        code: 3
      }
    }
  }

  @get('/gethotkey') //获取热门搜索
  async getHotkeys(ctx, next) {
    const movies = await getHotKey()
    ctx.body = {
      code: 0,
      data: {
        movies
      },
      errmsg: ''
    }
  }

  @get('get_cats')
  async getCategorys(ctx, next) {
    const arr = await getCategorys()
    ctx.body = {
      code: 0,
      data: arr
    }
  }
}