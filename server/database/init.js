const glob = require('glob')
const { resolve } = require('path')
const mongoose = require('mongoose')
const db = 'mongodb://localhost/movie-trailer'

mongoose.Promise = global.Promise

exports.connect = () => {
  let maxConnectTimes = 0
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
    mongoose.connect(db)
    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('database error')
      }
    })
    mongoose.connection.on('error', err => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('database error')
      }
    })
    mongoose.connection.on('open', () => {
      resolve('MongoDB Connected successful!')
    })
  })
}

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}