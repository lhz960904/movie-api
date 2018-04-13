const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Mixed } = Schema.Types

const movieSchema = new Schema({
  doubanId: {
    unique: true,
    type: String
  },
  rate: {
    type: Number,
    default: 0
  },
  isPlay: {
    type: Number,
    default: 1
  },
  author: String,
  title: String,
  en_title: String,
  poster: String,
  posterKey: String,
  summary: String,
  pubdate: Mixed,
  casts: [{
    avatar: String,
    name: String
  }],
  images: [String],
  duration: String,
  video: String,
  videoKey: String,
  movieTypes: [String],
  category: [{
    type: ObjectId,
    ref: 'Category'
  }],
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

movieSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

mongoose.model('Movie', movieSchema)