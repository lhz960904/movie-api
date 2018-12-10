const { 
  get, 
  post, 
  controller, 
  required,
  success 
} = require('../lib/decorator')

const {
  _getHot,
  _getMovies,
  _getSpecialMovies,
  getMovieDetail,
  getRelativeMovies,
  searchMovie,
  delMovieTypes,
  getHotKey,
  getCategorys
} = require('../service/movie')

@controller('/api/movie')
export class movieController {

  @get('/get_hot') // 获取首页推荐电影
  async getHot (ctx, next) {
    const data = await _getHot()
    success(ctx, data)
  }

  @get('/get_movies') // 获取不同状态电影，可分页
  @required({
    'query': ['page', 'page_size', 'type']
  })
  async getMovies (ctx, next) {
    const data = await _getMovies(ctx.query)
    success(ctx, data)
  }
  
  @get('/get_special_movies') // 获取筛选后的电影
  @required({
    'query': ['categories', 'rate', 'type']
  })
  async getSpecialMovies (ctx) {
    const data = await _getSpecialMovies(ctx.query)
    success(ctx, data)
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