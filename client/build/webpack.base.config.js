const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const os = require('os');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const utils = require('./utils');
const config = require('../config');
const isProd = process.env.NODE_ENV === 'production';
const { createEntry } = require('./html.conf');
const webpack = require('webpack');
const path = require('path');

const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [utils.resolve('src')],
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
});
const dllPlugin = () => {
    const { dll } = config;
    return Object.keys(dll).map(item => new webpack.DllReferencePlugin({
        manifest: require(path.join(config.build.assetsRoot, config.build.assetsManifestRoot, `${item}-manifest.json`))
    }));
};
const baseConfig = {
    mode: 'development',
    entry: createEntry(),
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: isProd
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    module: {
        rules: [
            ...(config.dev.useEslint ? [createLintingRule()] : []),
            {
                test: /\.vue$/,
                use: [
                    'cache-loader',
                    'vue-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    'cache-loader',
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: { appendTsxSuffixTo: [/\.vue$/] }
                    }
                ]
            },
            {
                test: /\.jsx?$/,
                use: ['cache-loader', 'happypack/loader?id=js'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: !isProd
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: utils.assetsPath('images/[name].[hash:7].[ext]')
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: utils.assetsPath('media/[name].[hash:7].[ext]')
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': utils.resolve('src')
        }
    },
    plugins: [
        // new HappyPack({
        //     id: 'ts',
        //     threadPool: happyThreadPool,
        //     loaders: ['ts-loader']
        // }),
        new HappyPack({
            id: 'js',
            threadPool: happyThreadPool,
            loaders: ['babel-loader']
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: utils.assetsPath(`css/${isProd ? '[name].[hash].css' : '[name].css'}`),
            chunkFilename: utils.assetsPath(`css/${isProd ? '[id].[hash].css' : '[id].css'}`)
        }),
        ...dllPlugin()
    ]
};
module.exports = baseConfig;
