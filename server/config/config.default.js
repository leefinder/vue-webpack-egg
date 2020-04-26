const path = require('path');
module.exports = appInfo => {
    const config = exports = {};
    config.keys = appInfo.name + '1556598641693';
    config.middleware = ['timeMonitor'],
    config.cluster = {
        listen: {
            port: 19001,
            hostname: '0.0.0.0',
        }
    };
    config.static = {
        prefix: '/public',
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
            useSession: false,
            ignoreJSON: false,          // skip check JSON requests if ignoreJSON set to true
            sessionName: 'csrfToken',   // csrf token's session name
            cookieName: 'csrfToken',    // csrf token's cookie name
            headerName: 'x-csrf-token', // request csrf token's name in header
            bodyName: '_csrf',          // request csrf token's name in body
            queryName: '_csrf'
        }
    };
    config.multipart = {
        fileExtensions: [ '.doc', '.docx', '.pdf' ] // 增加对 apk 扩展名的文件支持
    };
    return {
        ...config,
    };
};