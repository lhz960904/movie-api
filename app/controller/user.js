'use strict';

const { Controller } = require('egg');

class UserController extends Controller {
  async login() {
    // todo
    this.ctx.body = 'login';
  }
  async register() {
    const { ctx } = this;
    const { email, password } = ctx.request.body;
    const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!pattern.test(email)) {
      this.ctx.body = '邮箱格式不正确';
      return;
    }
    if (password.length < 6) {
      this.ctx.body = '密码长度小于6位';
      return;
    }
    const bool = await this.service.user.checkEmail(email);
    if (bool) {
      this.ctx.body = '邮箱已经被注册';
      return;
    }
    const data = await this.service.user.registerUser(ctx.request.body);
    this.ctx.body = data;
  }
  async logout() {
    // todo
    this.ctx.body = 'logout';
  }
  async getCollects() {
    // todo
    this.ctx.body = 'getCollects';
  }
  async getInfo() {
    // todo
    this.ctx.body = 'getInfo';
  }
}

module.exports = UserController;
