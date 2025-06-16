'use strict';

const fs = require('fs');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const paths = require('./paths');

const host = process.env.HOST || '0.0.0.0';

module.exports = function () {
  return {
    compress: true,
    static: {
      directory: paths.devAppBuild,
      publicPath: '',
      watch: true,
    },
    hot: true,
    host,
    client: {
      logging: 'none',
      overlay: false,
    },
    historyApiFallback: {
      disableDotRule: true,
    },
    watchFiles: {
      paths: [paths.appSrc + '/**/*'],
      options: {
        ignored: ignoredFiles(paths.appSrc),
      },
    },
    setupMiddlewares: (middlewares, devServer) => {
      middlewares.unshift(evalSourceMapMiddleware(devServer));
      middlewares.unshift(errorOverlayMiddleware());
      return middlewares;
    },
  };
};
