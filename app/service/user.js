'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async login({ email, password }) {
    let match = false;
    const user = await this.ctx.model.User.findOne({ email });
    if (user) {
      match = await user.comparePassword(password, user.password);
    }
    return { match, user };
  }
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email });
    return !!user;
  }
  async registerUser({ username, email, password }) {
    const user = new this.ctx.model.User({
      username,
      email,
      password,
    });
    await user.save();
    return { user };
  }
}

module.exports = UserService;
