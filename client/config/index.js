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
        assetsIndex: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static/webpack',
        assetsPublicPath: '/public/',
        assetsRoot: path.resolve(__dirname, '../dist/public'),
        assetsDllRoot: 'static/dll',
        assetsManifestRoot: 'static/manifest',
        devtool: '#source-map'
    },
    dll: {
        vue: ['vue', 'mint-ui'],
        vueTools: ['vue-router', 'vuex', 'vue-awesome-swiper'],
        utils: ['axios', 'clipboard', 'qs', 'nativeshare'],
        jquery: ['jquery']
    }
};
