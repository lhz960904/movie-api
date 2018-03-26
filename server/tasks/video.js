const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

;(async () => {
  let movies = await Movie.find({
    $or: [
      {video: {$exists: false}},
      {video: null},
      {casts: []},
    ]
  })
  const script = resolve(__dirname, '../crawl/trailer_video')
  const child = cp.fork(script, [])
  let invoked = false

  child.on('error', err => {
    if (invoked) return
    invoked = true
    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return
    invoked = true
    let err = code === 0 ? 'crawl successful!' : new Error('exit code' + code)
    console.log(err)
  })

  child.on('message', async data => {
    let doubanId = data.doubanId
    let movie = await Movie.findOne({
      doubanId: doubanId
    })
    if (data.video) {
      movie.video = data.video
      movie.casts = data.casts
      movie.images = data.images
      await movie.save()
    } else {
      await movie.remove()
      let movieTypes = movie.movieTypes
      for (let i = 0; i < movieTypes.length; i++) {
        let type = movieTypes[i]
        let cat = await Category.findOne({
          name: type
        })
        if (cat) {
          let idx = cat.movies.indexOf(movie._id)
          if (idx > -1) {
            cat.movies = cat.movies.splice(idx, 1)
          }
          await cat.save()
        }
      }
    }
  })
  child.send(movies)
})()