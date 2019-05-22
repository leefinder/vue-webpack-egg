const path = require('path');
module.exports = appInfo => {
    const config = exports = {};
    config.keys = appInfo.name + '1556598641693';
    config.middleware = ['mockData'],
    config.cluster = {
        listen: {
            port: 19001,
            hostname: '0.0.0.0',
        }
    };
    config.static = {
        prefix: '/',
        dir: path.join(appInfo.baseDir, 'app/public'),
        dynamic: true,
        preload: false
    };
    config.view = {
        defaultViewEngine: 'art',
        root: [
            path.join(appInfo.baseDir, 'app/view')
        ].join(',')
    };
    config.art = {
        writeResp: true,
        debug: false,
        htmlMinifierOptions: {
            collapseWhitespace: true,
            minifyCSS: false,
            minifyJS: false,
            // 运行时自动合并：rules.map(rule => rule.test)
            ignoreCustomFragments: []
        }
    };
    config.security = {
        csrf: {
            enable: true
        }
    };
    const userConfig = {

    };
    return {
        ...config,
        ...userConfig
    };
};