const baseConfig = require('./webpack.base.conf')
const config = require('../config')
const utils = require('./utils')
const merge = require('webpack-merge')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const prodConfig = merge(baseConfig, {
    mode: 'production',
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    optimization: {
        namedChunks: true,
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            cacheGroups: {
                vue: {
                    name: 'vue', // 要缓存的 分隔出来的 chunk 名称
                    test: /[\\/]node_modules[\\/](vue|vuex|vue-router)[\\/]/,
                    priority: 1, // 缓存组优先级
                    chunks: 'all',
                    reuseExistingChunk: true // 可设置是否重用该chunk（查看源码没有发现默认值）
                },
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                sourceMap: config.build.productionSourceMap
            }),
            new OptimizeCSSAssetsPlugin(),
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            chunkFilename: utils.assetsPath('css/[id].[contenthash].css'),
        }),
    ]
})
module.exports = prodConfig