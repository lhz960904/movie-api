const qiniu = require('qiniu')
const nanoid = require('nanoid')
const config = require('../config')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const conf = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, conf)

const uploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    bucketManager.fetch(url, bucket, key, function (err, respBody, respInfo) {
      if (err) {
        reject(err)
      } else {
        if (respInfo.statusCode == 200) {
          resolve({key})
        } else {
          reject(respBody)
        }
      }
    })
  })
}

;(async () => {
  const movies = await Movie.find({
    $or: [
      {videoKey: {$exists: false}},
      {videoKey: null},
      {videoKey: ''}
    ]
  })
  for (let i = 0; i < [movies[0]].length; i++) {
    let movie = movies[i]
    if (movie.video && !movie.videoKey) {
      try { 
        let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
        let posterData = await uploadToQiniu(movie.poster, nanoid() + '.jpg')
        const arr = []
        for (let i = 0; i < movie.images.length; i++) {
          let { key } = await uploadToQiniu(movie.images[i], nanoid() + '.jpg')
          if (key) {
            arr.push(key)
          }
        }
        movie.images = arr
        for (let j = 0; j < movie.casts.length; j++) {
          if (!movie.casts[j].avatar) continue;
          let { key } = await uploadToQiniu(movie.casts[j].avatar, nanoid() + '.jpg')
          if (key) {
            movie.casts[j].avatar = key
          }
        }
        if (videoData.key) {
          movie.videoKey = videoData.key
        }
        if (posterData.key) {
          movie.posterKey = posterData.key
        }
        
        await movie.save()
      } catch (error) {
        console.log(error)
      }
    }
  }
})()