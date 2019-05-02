const utils = require('./utils')
const path = require('path')
const entries = require('./entries')
const config = require('../config')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const createEntry = () => {
    const o = {}
    entries.forEach(item => {
        o[item.name] = utils.resolve(item.path)
    })
    return o
}
const htmlPlugins = () => {
    return entries.map(item => new HtmlWebpackPlugin({
        template: 'index.html',
        filename: isProd ? path.resolve(config.build.indexRoot, `${item.name}.html`) : `${item.name}.html`,
        chunks: ['manifest', item.name],
        inject: true,
        // minify: {
        //     removeComments: true,
        //     collapseWhitespace: true,
        //     removeAttributeQuotes: true,
        //     minifyJS: true
        //     // more options:
        //     // https://github.com/kangax/html-minifier#options-quick-reference
        // },
    }))
}
const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [utils.resolve('src')],
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
})
const isProd = process.env.NODE_ENV === 'production'
const baseConfig = {
    entry: createEntry(),
    output: {
        path: config.build.assetsRoot,
        publicPath: isProd ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath,
        filename: utils.assetsPath(isProd ? 'js/[name].[chunkhash].js' : '[name].js'),
        chunkFilename: utils.assetsPath(isProd ? 'js/[id].[chunkhash].js' : '[id].js')
    },
    module: {
        rules: [
            ...(config.dev.useEslint ? [createLintingRule()] : []),
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /\node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    isProd ? {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true
                        }
                    } : 'style-loader',
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
                    isProd ? {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true
                        }
                    } : 'style-loader',
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
                    },
                    
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.vue', '.less', '.css'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': utils.resolve('src')
        }
    },
    plugins: [
        ...htmlPlugins(),
        new VueLoaderPlugin()
    ]
}
module.exports = baseConfig;