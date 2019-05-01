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
        runtimeChunk: {
            name: 'runtime'
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                sourceMap: config.build.productionSourceMap
            }),
            new OptimizeCSSAssetsPlugin(),
        ],
        splitChunks: {
            chunks: 'all',
            minSize: 4000
        },
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