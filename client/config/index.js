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
        assetsSubDirectory: 'static/webpack',
        assetsPublicPath: '/public/',
        assetsRoot: path.resolve(__dirname, '../../server/app/public'),
        assetsDllRoot: 'static/dll',
        assetsManifestRoot: 'static/manifest',
        devtool: '#source-map'
    },
    dll: {
        vue: ['vue', 'vue-router', 'vuex'],
        axios: ['axios'],
        clipboard: ['clipboard'],
        vueAwesomeSwiper: ['vue-awesome-swiper'],
        qs: ['qs'],
        nativeshare: ['nativeshare'],
        mintUi: ['mint-ui'],
        jquery: ['jquery']
    }
};
