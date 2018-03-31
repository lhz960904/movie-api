const mongoose = require('mongoose')
const User = mongoose.model('User')

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