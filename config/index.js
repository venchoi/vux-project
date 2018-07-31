'use strict'
// Template version: 1.2.4
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const poxyOrigin = 'http://m.duoyingle.com'//'http://rap.duoyingle.com/mockjsdata/1/'
module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // proxyTable: {},

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    proxyTable: {
      '/news': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/news': '/news'
        }
      },
      '/user': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/user': '/user'
        }
      },
      '/account': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/account': '/account'
        }
      },
      '/market': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/market': '/market'
        }
      },
      '/optiontrade': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/optiontrade': '/optiontrade'
        }
      },
      '/pay': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/pay': '/pay'
        }
      }
    }
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * 
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
  }
}