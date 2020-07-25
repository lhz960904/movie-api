'use strict';

const Controller = require('egg').Controller;

class MovieController extends Controller {
  async index() {
    const { ctx, service } = this;

    const movies = await service.movie.index(ctx.query);

    this.ctx.sendSuccess(movies)
  }

  // 获取热门电影
  async getHot() {
    const { ctx, service } = this;

    const comming = await service.movie.getHot('0');
    const playing = await service.movie.getHot('1');
    ctx.sendSuccess({ comming, playing })
  }

  // 获取不同状态的电影列表
  async getByStatus() {
    const { ctx, service } = this;
    const params = { page: 0, pageSize: 10, ...ctx.query };
    const result = await service.movie.getByStatus(params);
    ctx.sendSuccess(result)
  }

  // 电影排行榜(观看数前10)
  async getRank() {
    const { ctx, service } = this;
    const result = await service.movie.getRank();
    ctx.sendSuccess(result)
  }

  // 获取详情
  async show() {
    const { ctx, service } = this;
    const result = await service.movie.getDetail(ctx.params.id);
    if (result) {
      ctx.sendSuccess(result)
    } else {
      ctx.sendError('未查找到对应电影！')
    }
  }

  // 通过关键词搜索电影
  async search() {
    const { ctx, service } = this;
    const { keyword } = ctx.query;
    // 1.update keyword count
    await service.keyword.updateOrCreate(keyword);
    // 2.search movies by keyword
    const result = await service.movie.index({ keyword });
    ctx.sendSuccess(result)
  }
}

module.exports = MovieController;
