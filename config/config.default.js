/* eslint valid-jsdoc: "off" */

'use strict';

module.exports = appInfo => {

  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1595641144811_3440';

  // add your middleware config here
  config.middleware = [];

  config.mysql = {
    // database configuration
    client: {
      // host
      host: 'localhost',
      // port
      port: '3306',
      // username
      user: 'lihaoze',
      // password
      password: '549888',
      // database
      database: 'movie_trailer',    
    },
  }

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'www.vip.sc' ],
  };

  config.cors = {
    enable: true,
    package: 'egg-cors',
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
