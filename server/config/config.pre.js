module.exports = () => {
    const config = {};
    // add http_proxy to httpclient 
    // 抓包 example -- http_proxy=http://127.0.0.1:8888 npm run dev
    if (process.env.http_proxy) {
        config.httpclient = {
            request: {
                enableProxy: true,
                rejectUnauthorized: false,
                proxy: process.env.http_proxy,
            },
        };
    }
    config.cluster = {
        listen: {
            port: 19001,
            hostname: '0.0.0.0',
        }
    };
    config.requestRoot = 'https://lpassis-dev.leapmotor.com';
    return config;
};
