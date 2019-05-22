module.exports = () => {
    const config = exports = {};
    config.cluster = {
        listen: {
            port: 19001,
            hostname: '0.0.0.0',
        }
    };
    config.requestRoot = '';
    return {
        ...config
    };
};