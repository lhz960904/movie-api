const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')
const rp = require('request-promise-native')

async function fetchMovie(item) {
  const url = `http://api.douban.com/v2/movie/${item.doubanId}`
  const res = await rp(url)
  return JSON.parse(res)
}

;(async () => {
  let movies = await Movie.find({
    $or: [
      {summary: {$exists: false}},
      {summary: null},
      {summary: ''},
      {title: ''},
      {author: ''},
      {duration: ''}
    ]
  })
  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i]
    let movieData = await fetchMovie(movie)
    if (movieData) {
      movie.author = movieData.author && movieData.author[0].name || ''
      movie.title = movieData.alt_title || ''
      movie.summary = movieData.summary || ''
      if (movieData.attrs) {
        movie.duration = movieData.attrs.movie_duration || ''
        movie.movieTypes = movieData.attrs.movie_type || []
        for (let j = 0; j < movie.movieTypes.length; j++) {
          let item = movie.movieTypes[j]
          let cat = await Category.findOne({
            name: item
          })
          if (!cat) {
            cat = new Category({
              name: item,
              movies: [movie._id]
            })
          } else {
            if (cat.movies.indexOf(movie._id) === -1) {
              cat.movies.push(movie._id)
            }
          }
          await cat.save()

          if (!movie.category) {
            movie.category.push(cat._id)
          } else {
            if (movie.category.indexOf(cat._id) === -1) {
              movie.category.push(cat._id)
            }
          }
        }
        let dates = movieData.attrs.pubdate || []
        let pubdates = []
        dates.map(item => {
          if (item && item.split('(').length > 0) {
            let parts = item.split('(')
            let date = parts[0]
            let country = '未知'
            if (parts[1]) {
              country = parts[1].split(')')[0]
            }
            pubdates.push({
              date: new Date(date),
              country
            })
          }
        })
        movie.pubdate = pubdates
      }
      await movie.save()
    }
  }
})()