'use strict';

module.exports = appInfo => {

  const config = exports = {};

  // cookie sign key
  config.keys = appInfo.name + '_1561781448031_2926';

  // view
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };

  // middleware
  config.middleware = [];

  // mongoose
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/movie-trailer',
      options: {},
    },
  };

  // 安全
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // user config
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
