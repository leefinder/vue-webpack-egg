const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const vConsolePlugin = require('vconsole-webpack-plugin')

const portfinder = require('portfinder')
const config = require('../config');
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devConfig = merge(baseConfig, {
    mode: 'development',
    devtool: config.dev.devtool,
    devServer: {
        port: PORT || config.dev.port,
        host: HOST || config.dev.host,
        publicPath: config.dev.assetsPublicPath,
        hot: true,
        quiet: true
    },
    plugins: [
        new webpack.DefinePlugin({
             'process.env': require('../config/dev.env')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new vConsolePlugin({
            enable: true
        })
    ]
})

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPortPromise().then(port => {
        // publish the new Port, necessary for e2e tests
        process.env.PORT = port
        // add port to devServer config
        devConfig.devServer.port = port
  
        // Add FriendlyErrorsPlugin
        devConfig.plugins.push(new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Your application is running here: http://${devConfig.devServer.host}:${port}`],
          },
        //   onErrors: config.dev.notifyOnErrors
        //   ? utils.createNotifierCallback()
        //   : undefined
        }))
  
        resolve(devConfig)
      }).catch(err => {
          reject(err)
      })
  })