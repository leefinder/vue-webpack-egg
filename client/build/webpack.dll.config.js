const path = require('path');
const webpack = require('webpack');
const config = require('../config');
module.exports = {
    mode: 'production',
    entry: config.dll,
    output: {
        path: path.join(config.build.assetsRoot, config.build.assetsDllRoot),
        filename: '[name]_[hash].dll.js',
        library: '[name]_[hash]_library'
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(config.build.assetsRoot, config.build.assetsManifestRoot, '[name]-manifest.json'),
            name: '[name]_[hash]_library'
        })
    ]
};
