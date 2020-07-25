'use strict';

const Controller = require('egg').Controller;

class KeyWordController extends Controller {
  async index() {
    const { ctx, service } = this;

    const keywordList = await service.keyword.index();

    ctx.sendSuccess(keywordList)
  }
}

module.exports = KeyWordController;
