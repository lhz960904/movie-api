const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')
const User = mongoose.model('User')
const Keyword = mongoose.model('Keyword')

/**
 * 获取首页热门推荐
 */
export const _getHot = async () => {
  const playingCount = await Movie.find({ isPlay: 1 }).count()
  const playingMovies = await Movie.find({ isPlay: 1 }).limit(8).sort({ rate: -1 })

  const commingCount = await Movie.find({ isPlay: 0 }).count()
  const commingMovies = await Movie.find({ isPlay: 0 }).limit(8)
  
  return { playingMovies, commingMovies, playingCount, commingCount }
}

/**
 * 获取符合条件的电影条数
 * @param {Number} page_size 每页数量
 * @param {Number} page 页码 从1开始
 * @param {Number} type 1 正在上映 0 即将上映
 */
export const _getMovies = async ({ page_size, page, type }) => {
  const query = { isPlay: type }
  const skipPage = (page - 1) * page_size
  const count = await Movie.find(query).count()
  // 如果type 为 0 不需要按照评分排序
  let movies = []
  if (+type === 1) {
    movies = await Movie.find(query).skip(skipPage).limit(+page_size).sort({ rate: -1 })
  } else {
    movies = await Movie.find(query).skip(skipPage).limit(+page_size)
  }
  return { movies, count }
}

/**
 * 获取符合条件得电影数据
 * @param {Number} categories 电影种类数组
 * @param {Number} page 页码 从1开始
 * @param {Number} type 1 正在上映 0 即将上映
 */
export const _getSpecialMovies = async ({ categories, type, rate }) => {
  let query = {
    isPlay: type,
    movieTypes: {
      $in: JSON.parse(categories)
    }
  }
  rate = JSON.parse(rate)
  if (+type === 1) {
    query.rate = {
      $gte: rate[0],
      $lte: rate[1]
    }
  }
  const movies = await Movie.find(query)
  return { movies }
}

/**
 * 获取榜单电影、只展示前10条
 */
export const _getRank = async () => {
  const movies = await Movie.find({}).sort({ viewCount: -1 }).limit(10)
  return { movies }
}

/**
 * 搜索电影
 * @param {String} keyword 关键字
 */
export const _searchMovie = async ({ keyword }) => {
  let key = await Keyword.findOne({
    name: keyword
  })
  if (key) {
    key.count += 1
  } else {
    key = new Keyword({
      name: keyword,
      count: 1
    })
  }
  await key.save()
  
  const movies = await Movie.find({
    $or: [
      { title: { '$regex': keyword, $options: '$i' } }
    ]
  }).sort({ viewCount: -1 })
  return { movies }
}

/**
 * 获取最热搜索
 */
export const _getHotSearch = async () => {
  const keywords = await Keyword.find({}, 'name count').sort({ 'count': -1 }).limit(10)
  return { keywords }
}

/**
 * 通过id获取单条电影信息
 * @param {String} id 电影id
 */
export const _getMovieDetail = async ({ id }) => {
  let movie = await Movie.findOne({_id: id})
  movie.viewCount += 1
  await movie.save()
  const relativeMovies = await Movie.find({
    movieTypes: {
      $in: movie.movieTypes
    }
  }).sort({ rate: -1 }).limit(6)
  return { movie, relativeMovies }
}

export const _collectMovie = async (userId, movieId) => {
  const user = await User.findOne({ _id: userId })
  const idx = user.collects.indexOf(movieId)
  if (idx > -1) {
    user.collects.splice(idx, 1)
  } else {
    user.collects = user.collects.concat(movieId)
  }
  try {
    await user.save()
    return true
  } catch (err) {
    return false
  }
}