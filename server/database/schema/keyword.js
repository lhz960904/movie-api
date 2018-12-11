const mongoose = require('mongoose')
const Schema = mongoose.Schema

const keywordSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

mongoose.model('Keyword', keywordSchema)

