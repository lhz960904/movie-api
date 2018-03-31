const mongoose = require('mongoose')
const Category = mongoose.model('Category')

export const getMoiveTypes = async () => {
  const movieTypes = await Category.find({})
  return movieTypes
}

