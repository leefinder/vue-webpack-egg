'use strict';
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const root = require('./entries');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const path = require('path');
const VConsolePlugin = require('vconsole-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);
const htmlPlugins = () => {
    return root.map(item => new HtmlWebpackPlugin({
        title: `${item.title}`,
        template: utils.resolve(`${item.template ? item.template : 'index.html'}`),
        filename: `${item.name}.html`,
        chunks: [item.name],
        inject: true
    }));
};
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
                { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'home.html') }
            ]
        },
        proxy: {
            '/proxy': 'http://10.192.26.138:19001'
        }
    },
    plugins: [
        ...htmlPlugins(),
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
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
