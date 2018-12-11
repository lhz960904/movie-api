const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Mixed } = Schema.Types

const movieSchema = new Schema({
  doubanId: {
    unique: true,
    type: Number
  },
  author: String,
  title: String,
  enTitle: String,
  summary: String,
  rate: Number,
  duration: String,
  movieTypes: [String],
  pubdate: String,
  poster: String,
  casts: [{
    name: String,
    avatar: String
  }],
  cover: String,
  video: String,
  isPlay: {
    type: Number,
    default: 0 // 1: 上映中 0: 即将上映
  },
  viewCount: {
    type: Number,
    default: 0
  },
  // images: [String],
  // posterKey: String,
  // videoKey: String,
  // coverKey: String,
}, {
  timestamps: true
})

mongoose.model('Movie', movieSchema)