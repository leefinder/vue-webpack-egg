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
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const { htmlPlugins } = require('./html.conf');
const isProd = process.env.NODE_ENV === 'production'
// 预渲染
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
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
                        drop_console: isProd
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
                    minChunks: 1,
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
            'process.env': require(isProd ? '../config/prod.env' : '../config/pre.env')
        }),
        ...htmlPlugins(),
        new AddAssetHtmlPlugin({
            publicPath: `${config.build.assetsPublicPath}${config.build.assetsDllRoot}`,
            outputPath: config.build.assetsDllRoot,
            filepath: path.resolve(config.build.assetsRoot, 'static/dll/*.dll.js')
        }),
        new CopyWebpackPlugin([
            { from: utils.resolve('src/static/img/favicon.ico'), to: config.build.assetsIndex },
        ]),
        new CleanSourceMapWebpackPlugin({
            sourceMapPath: [`${config.build.assetsSubDirectory}\\js\\*.js.map`],
            dangerouslyAllowCleanPatternsOutsideProject: true
        }),
        new PrerenderSPAPlugin({
            // 生成文件的路径，也可以与webpakc打包的一致。
            // 下面这句话非常重要！！！
            // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
            staticDir: path.join(__dirname, '../dist'),
      
            // Optional - The location of index.html
            // indexPath: path.join(__dirname, '../dist', 'index.html'),
      
            // 对应自己的路由文件，比如a有参数，就需要写成 /a/param1。
            routes: [
                '/'
            ],
            // 这个很重要，如果没有配置这段，也不会进行预编译
            renderer: new Renderer({
                renderAfterTime: 5000,
                inject: {
                    foo: 'bar'
                },
                headless: true,
                maxConcurrentRoutes: 4,
                renderAfterDocumentEvent: 'render-event', // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
            })
        })
    ]
});
module.exports = webpackConfig;
