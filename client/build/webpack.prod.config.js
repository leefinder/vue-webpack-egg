'use strict';
const utils = require('./utils');
const config = require('../config');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.config');
const OptimizeCss = require('optimize-css-assets-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const { htmlPlugins } = require('./html.conf');
const webpackConfig = merge(baseWebpackConfig, {
    devtool: config.build.devtool,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    optimization: {
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
        new webpack.DefinePlugin({
            'process.env': require('../config/prod.env')
        }),
        ...htmlPlugins(),
        new OptimizeCss(),
        new AddAssetHtmlPlugin({
            publicPath: `${config.build.assetsPublicPath}${config.build.assetsDllRoot}`,
            outputPath: config.build.assetsDllRoot,
            filepath: path.resolve(config.build.assetsRoot, 'static/dll/*.dll.js')
        }),
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true
        })
    ]
});
module.exports = webpackConfig;
