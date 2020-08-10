'use strict';
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const path = require('path');
const VConsolePlugin = require('vconsole-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const { htmlPlugins } = require('./html.conf');
const isActivity = process.env.NODE_PRO === 'activity';
const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);
const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: config.dev.devtool, // cheap-module-eval-source-map
    devServer: {
        hot: true,
        contentBase: false,
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: false,
        publicPath: config.dev.assetsPublicPath,
        quiet: true,
        historyApiFallback: {
            rewrites: [
                { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }
            ]
        },
        proxy: {
            '/proxy': 'http://localhost:19001'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': Object.assign(require('../config/dev.env'), {
                NODE_PRO: isActivity ? '"activity"' : '"website"'
            })
        }),
        ...htmlPlugins(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new AddAssetHtmlPlugin({
            filepath: path.resolve(config.build.assetsRoot, config.build.assetsDllRoot, '*.dll.js')
        }),
        new VConsolePlugin({
            enable: true
        })
    ]
});

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port;
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err);
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port;
            // add port to devServer config
            devWebpackConfig.devServer.port = port;

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`App listen at url: http://${devWebpackConfig.devServer.host}:${port}`]
                },
                onErrors: config.dev.notifyOnErrors
                    ? utils.createNotifierCallback()
                    : undefined
            }));
            resolve(devWebpackConfig);
        }
    });
});
