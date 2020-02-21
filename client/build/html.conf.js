const HtmlWebpackPlugin = require('html-webpack-plugin');
const root = require('./entries');
const isActivity = process.env.NODE_PRO === 'activity';
const utils = require('./utils');
const isProd = process.env.NODE_ENV === 'production';
const buildRoot = !isProd ? root : (isActivity ? root.filter(item => item.isAct) : root.filter(item => !item.isAct));
const config = require('../config');
module.exports = {
    createEntry () {
        const entries = {};
        buildRoot.forEach(item => {
            const { name, path } = item;
            entries[name] = utils.resolve(path);
        });
        return entries;
    },
    htmlPlugins () {
        return buildRoot.map(item => new HtmlWebpackPlugin({
            title: `${item.title}`,
            keywords: `${item.keywords}`,
            description: `${item.description}`,
            template: utils.resolve(`${item.template ? item.template : 'index.html'}`),
            favicon: utils.resolve('src/static/img/favicon.ico'),
            filename: isProd ? `${config.build.assetsIndex}/${item.root}.html` : `${item.root}.html`,
            chunks: isProd ? ['manifest', 'common', 'styles', item.name] : [item.name],
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true
            },
            inject: true
        }));
    }
};
