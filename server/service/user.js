const mongoose = require('mongoose')
const User = mongoose.model('User')
const Movie = mongoose.model('Movie')
// const fs = require('fs')
// const path = require('path')

/**
 * 用户登录, 判断密码是否正确
 * @param {String} email 邮箱
 * @param {String} password 密码
 */
export const _login = async ({ email, password }) => {
  let match = false
  const user = await User.findOne({ email })
  if (user) {
    match = await user.comparePassword(password, user.password)
  }
  return { match, user }
}

/**
 * 检查email邮箱是否存在
 * @param {String} email
 */
export const _checkEmail = async ({ email }) => {
  const user = await User.findOne({ email })
  return !!user
}

/**
 * 注册用户
 * @param {String} username 用户名
 * @param {String} email 邮箱
 * @param {String} password 密码
 */
export const _registerUser = async ({ username, email, password }) => {
  const user = new User({
    username,
    email,
    password
  })
  await user.save()
  return { user }
}

/**
 * 查看用户收藏列表
 */
export const _getCollects = async (userId) => {
  const movies = await User.findOne({ _id: userId }, 'collects').populate('collects')
  return { movies: movies.collects }
}