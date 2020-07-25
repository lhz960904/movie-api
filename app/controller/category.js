'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {
  async index() {
    const { ctx, service } = this;

    const categoryList = await service.category.index();

    this.ctx.sendSuccess(categoryList)
  }
}

module.exports = CategoryController;
