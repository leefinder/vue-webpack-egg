'use strict';
const utils = require('./utils');
const config = require('../config');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.config');
const OptimizeCss = require('optimize-css-assets-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanSourceMapWebpackPlugin = require('../plugins/clean-source-map-webpack-plugin');
const path = require('path');
const { htmlPlugins } = require('./html.conf');
const isActivity = process.env.NODE_PRO === 'activity';

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    devtool: config.build.devtool,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    performance: {
        assetFilter (assetFilename) {
            return assetFilename.endsWith('.js');
        }
    },
    optimization: {
        minimizer: [
            new OptimizeCss(),
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        drop_console: true
                    }
                }
            })
        ],
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            chunks: 'all',
            minChunks: 1,
            minSize: 0,
            cacheGroups: {
                common: {
                    minChunks: isActivity ? 1 : 2,
                    test: /utils/,
                    name: 'common',
                    priority: 30
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true // 忽略到前面到配置，不管是minSize,maxSize等等，只要是css，都打包到同一个文件中
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/prod.env')
        }),
        ...htmlPlugins(),
        new AddAssetHtmlPlugin({
            publicPath: `${config.build.assetsPublicPath}${config.build.assetsDllRoot}`,
            outputPath: config.build.assetsDllRoot,
            filepath: path.resolve(config.build.assetsRoot, 'static/dll/*.dll.js')
        }),
        new CleanSourceMapWebpackPlugin({
            sourceMapPath: [`${config.build.assetsSubDirectory}\\js\\*.js.map`],
            dangerouslyAllowCleanPatternsOutsideProject: true
        })
    ]
});
module.exports = webpackConfig;
