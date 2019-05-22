'use strict';
const utils = require('./utils');
const config = require('../config');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.conf');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCss = require('optimize-css-assets-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const root = require('./entries');

const htmlPlugins = () => {
    return root.map(item => new HtmlWebpackPlugin({
        title: `${item.title}`,
        template: utils.resolve(`${item.template ? item.template : 'index.html'}`),
        filename: `${config.build.assetsIndex}/${item.name}.html`,
        chunks: ['manifest', 'vendor', item.name],
        inject: true
    }));
};
const webpackConfig = merge(baseWebpackConfig, {
    devtool: config.build.devtool,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    optimization: {
        minimize: true,
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    minChunks: 1,
                    minSize: 0,
                    priority: 98
                }
            }
        }
    },
    plugins: [
        ...htmlPlugins(),
        new webpack.DefinePlugin({
            'process.env': require('../config/prod.env')
        }),
        new OptimizeCss()
    ]
});
module.exports = webpackConfig;
