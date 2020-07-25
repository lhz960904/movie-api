'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 分类
  router.resources('category', '/api/category', controller.category);
  // 电影
  router.get('/api/movie/hot', controller.movie.getHot);
  router.get('/api/movie/status', controller.movie.getByStatus);
  router.get('/api/movie/rank', controller.movie.getRank);
  router.get('/api/movie/search', controller.movie.search);
  router.resources('movie', '/api/movie', controller.movie);
  // 关键词
  router.resources('keyword', '/api/keyword', controller.keyword);
  // 用户
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.post('/api/user/logout', controller.user.logout);
  router.get('/api/user/getInfo', controller.user.getInfo);
  
  // 手动执行任务
  router.get('/task/crawler', () => {
    app.runSchedule('./crawler.js')
  });
};
