const path = require('path');

module.exports = {
    dev: {
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        host: '0.0.0.0',
        port: 8090,
        notifyOnErrors: true,
        devtool: 'cheap-module-eval-source-map',
        showEslintErrorsInOverlay: true,
        useEslint: true
    },

    build: {
        assetsIndex: path.resolve(__dirname, '../../server/app/view'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        assetsRoot: path.resolve(__dirname, '../../server/app/public'),
        devtool: '#source-map'
    }
};
