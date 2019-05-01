const path = require('path')
module.exports = {
    dev: {
        notifyOnErrors: true,
        port: 8090,
        host: 'localhost',
        devtool: 'cheap-module-eval-source-map',
        assetsPublicPath: '/',
        assetsSubDirectory: 'static',
        useEslint: true,
        // If true, eslint errors and warnings will also be shown in the error overlay
        // in the browser.
        showEslintErrorsInOverlay: false,
    },
    build: {
        productionSourceMap: true,
        devtool: '#source-map',
        assetsPublicPath: '/',
        assetsRoot: path.resolve(__dirname, '../server/app/view'),
        assetsSubDirectory: 'static',
    }
}