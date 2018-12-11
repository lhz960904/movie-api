const mongoose = require('mongoose')
const Category = mongoose.model('Category')

/**
 * 获取所有标签
 */
export const _getCategorys = async () => {
  const cates = await Category.find({}, '_id name')
  return { cates }
}

