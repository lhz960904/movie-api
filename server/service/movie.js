const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')
const moment = require('moment')
/**
 * 获取符合条件的电影条数
 * @param {String} category 类型
 * @param {Number} page_size 每页数量
 * @param {Number} page 页码
 * @param {Number} type 1 正在上映 0 即将上映
 */
export const getAllMovies = async (category, page_size, page, type) => {
  let query = {}
  if (category) {
    query.movieTypes = {
      $in: [category]
    }
  }
  if (type) {
    query.isPlay = type
  }
  page_size = +page_size || ''
  page = +page || ''
  const start = page * page_size - page_size
  const count = await Movie.find(query).count()
  const movies = await Movie.find(query).skip(start).limit(page_size).sort({
    rate: -1
  })
  return {
    movies,
    count,
    page_size,
    page
  }
}

/**
 * 通过id获取单条电影信息
 * @param {String} id 电影id
 */
export const getMovieDetail = async (id) => {
  const movie = await Movie.findOne({_id: id})
  return movie
}

/**
 * 通过id获取与该电影相似的条目信息
 * @param {String} id 电影id
 */
export const getRelativeMovies = async (id) => {
  const movie = await Movie.findOne({ _id: id })
  const movies = await Movie.find({
    movieTypes: {
      $in: movie.movieTypes
    }
  })
  return movies
}

/**
 * 删除电影
 * @param {String} id 电影id
 */
export const deleteMoive = async (id) => {
  const movie = await Movie.findOne({ _id: id })
  if (movie) {
    try {
      await movie.remove()
      return true
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}

/**
 * 获取指定类型的电影条目数量
 * @param {String} type 电影类型
 */
export const getTypeCount = async (type) => {
  let keys = []
  let values = []
  const cats = await Category.find({})
  for (let i = 0; i < cats.length; i++) {
    const item = cats[i]
    keys.push(item.name)
    values.push({
      value: item.movies.length,
      name: item.name
    })
  }
  return {
    keys,
    values
  }
}

export const getLineData = async () => {
  let data = []
  const findIdx = (arr, date) => {
    return arr.findIndex((v, k) => {
      return v.date == date
    })
  }
  const movies = await Movie.find({})
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i]
    let date = movie.pubdate[movie.pubdate.length - 1].date
    date = moment(date).format('YYYY-MM-DD')
    let idx = findIdx(data, date)
    if (idx == -1) {
      data.push({
        date,
        value: 1
      })
    } else {
      data[idx].value += 1
    }
  }
  data.sort((a,b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
  var dateList = data.map(function (item) {
    return item.date;
  });
  var valueList = data.map(function (item) {
    return item.value;
  });
  return {
    dateList,
    valueList
  }
}

/**
 * 搜索电影
 * @param {String} q 关键字
 */
export const searchMovie = async (q) => {
  const movies = await Movie.find({
    $or: [
      { title: { '$regex': q, $options: '$i'}}
    ]
  })
  return movies
}