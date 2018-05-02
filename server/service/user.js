const mongoose = require('mongoose')
const User = mongoose.model('User')
const Movie = mongoose.model('Movie')
const fs = require('fs')
const path = require('path')
/**
 * 用户登录, 判断密码是否正确
 * @param {String} email 邮箱
 * @param {String} password 密码
 */
export const checkPassword = async (email, password) => {
  let match = false
  const user = await User.findOne({email})
  if (user) {
    match = await user.comparePassword(password, user.password)
  }
  return {
    match,
    user
  }
}

/**
 * 获取所有用户条目信息
 */
export const getAllUsers = async () => {
  const user = await User.find({}).sort({
    updatedAt: -1
  })
  return user || []
}

/**
 * 检查email邮箱是否存在
 * @param {String} email
 */
export const checkUser = async (email) => {
  const user = await User.findOne({ email })
  return !!user
}

/**
 * 注册用户
 * @param {String} username 用户名
 * @param {String} email 邮箱
 * @param {String} password 密码
 */
export const registerUser = async (username, email, password) => {
  const user = new User({
    username,
    email,
    password
  })
  try {
    await user.save()
  } catch (error) {
    return {
      msg: error
    }
  }
  return {
    result: true,
    user
  }
}

/**
 * 删除用户
 * @param {String} id 用户id
 */
export const deleteUser = async (id) => {
  const user = await User.findOne({_id:id})
  if (user) {
    try {
      await user.remove()
      return true
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}

/**
 * 收藏电影
 * @param {Number} id 电影id
 */
export const collectMovie = async (userId, movieId) => {
  let movie
  try {
    movie = await Movie.findOne({_id: movieId})
  } catch (error) {
    return false
  }
  const user = await User.findOne({_id: userId})
  if (movie && user) {
    const idx = user.collects.indexOf(movieId)
    if (idx === -1) {
      user.collects.push(movieId)
      await user.save()
    }
    return true
  } else {
    return false
  }
}

/**
 * 修改用户基本信息
 * @param {Object} data 用户信息
 */
export const modifyUser = async (data) => {
  const { id, email, username, password, job, headImg, birthday} = data
  let user = await User.findOne({_id: id})
  if (headImg) {
    if (user.headImg) {
      fs.unlinkSync(path.resolve(__dirname, `../../public/${user.headImg}`))
    }
    user.headImg = headImg
  }
  email && (user.email = email) 
  username && (user.username = username)
  password && (user.password = password)
  job && (user.job = job)
  birthday && (user.birthday = birthday)
  try {
    await user.save()
  } catch (error) {
    console.log(error)
    return false
  }
  return true
}