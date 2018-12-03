const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types
const SALT_WORK_FACTOR = 10
const ROLE_MAP = {
  'user': 0,
  'admin': 1
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    unique: true,
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: ROLE_MAP['user']
  }
}, {
  timestamps: true
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (error, hash) => {
      if (error) return next(error)
      this.password = hash
      next()
    })
  })
})

userSchema.methods = {
  comparePassword: function(_password, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch)
        else reject(isMatch)
      })
    })
  }
}

mongoose.model('User', userSchema)