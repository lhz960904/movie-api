'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.post('/api/user/login', controller.user.login);
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/logout', controller.user.logout);
  router.get('/api/user/get_collects', controller.user.getCollects);
  router.get('/api/user/get_info', controller.user.getInfo);
};
