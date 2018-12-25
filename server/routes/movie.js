const { 
  get, 
  controller, 
  required,
  auth,
  success 
} = require('../lib/decorator')

const {
  _getHot,
  _getMovies,
  _getSpecialMovies,
  _getRank,
  _searchMovie,
  _getHotSearch,
  _getMovieDetail,
  _collectMovie
} = require('../service/movie')

@controller('/api/movie')
export class movieController {

  @get('/get_hot') // 获取首页推荐电影
  async getHot (ctx, next) {
    const { playingMovies, commingMovies, playingCount, commingCount } = await _getHot()
    success(ctx, {
      comming: {
        count: commingCount,
        movies: commingMovies
      },
      playing: {
        count: playingCount,
        movies: playingMovies
      }
    })
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

  @get('/get_rank') //获取榜单电影
  async getRank(ctx, next) {
    const data = await _getRank()
    success(ctx, data)
  }

  @get('/search') // 搜索电影
  @required({
    query: ['keyword']
  })
  async searchMovie(ctx, next) {
    const data = await _searchMovie(ctx.query)
    success(ctx, data)
  }

  @get('/get_hot_search') // 获取热门搜索词
  async getHotSearch(ctx, next) {
    const data = await _getHotSearch(ctx.query)
    success(ctx, data)
  }

  @get('/get_detail/:id') // 通过id获取电影详情
  async getMovieDetail (ctx, next) {
    const data = await _getMovieDetail(ctx.params)
    success(ctx, data)
  }

  @get('/collect/:id') // 收藏或取消收藏电影
  @auth
  @required({
    params: ['id']
  })
  async collectMovie (ctx, next) {
    const bool = await _collectMovie(ctx.session.user._id, ctx.params.id)
    bool ? success(ctx, '操作成功') : error(ctx, '操作失败')
  }

}