const { get, post, put, del, controller } = require('../lib/decorator')
const {
  getAllMovies,
  getMovieDetail
} = require('../service/movie')

@controller('movies')
export class movieController {
  @get('/')
  async getAll (ctx, next) {
    const { type } = ctx.query
    const movies = await getAllMovies(type)

    ctx.body = {
      code: 0,
      errmsg: '',
      data: {
        movies
      }
    }
  }
  @get('/:id')
  async getMovie (ctx, next) {
    const id = ctx.params.id
    const movie = await getMovieDetail(id)
    // const relative_moives = await getRelativeMovies(movie)
    ctx.body = {
      code: 0,
      errmsg: '',
      data: {
        movie
      }
    }
  }
}

