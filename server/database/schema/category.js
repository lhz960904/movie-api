const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const categorySchema = new Schema({
  name: {
    unique: true,
    type: String
  },
  movies: [{
    type: ObjectId,
    ref: 'Movie'
  }]
}, {
  timestamps: true
})

mongoose.model('Category', categorySchema)