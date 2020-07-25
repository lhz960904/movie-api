'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 注册
  async register() {
    const { ctx, service } = this;

    const { email, password } = ctx.request.body;

    const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    if (!pattern.test(email)) {
      ctx.sendError('邮箱格式不正确')
      return
    }
    if (!password || password.length < 6) {
      ctx.sendError('密码长度小于6位')
      return
    }
    const bool = await service.user.checkEmail(email)
    if (bool) {
      ctx.sendError('邮箱已经被注册')
      return
    }
    
    try {
      await service.user.register(ctx.request.body);
      ctx.sendSuccess(true)
    } catch (error) {
      ctx.sendError(error)
    }
  }

  // 登录
  async login() {
    const { ctx, service } = this;

    const { email } = ctx.request.body;
    
    const bool = await service.user.checkEmail(email)
    if (!bool) {
      ctx.sendError('邮箱不存在')
      return
    }
    const result = await service.user.login(ctx.request.body);
    if (result) {
      ctx.session.userId = result.id;
      ctx.sendSuccess(true);
    } else {
      ctx.sendError('密码不正确')
    }
  }

  // 登出
  async logout() {
    const { ctx, service } = this;
    ctx.session.userId = '';
    ctx.sendSuccess(true)
  }

  // 获取信息
  async getInfo() {
    const { ctx, service } = this;

    const { userId } = ctx.session;

    if (!userId) {
      ctx.sendError('未登录');
      return
    }

    const result = await service.user.getInfo(userId);

    ctx.sendSuccess(result);
  }
}

module.exports = UserController;
