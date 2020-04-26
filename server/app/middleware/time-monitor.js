module.exports = () => {
    return async function timeMonitor (ctx, next) {
        const sTime = new Date().getTime();
        const { path } = ctx;
        await next();
        const eTime = new Date().getTime();
        console.log(`请求地址: ${path}, 响应时间: ${eTime - sTime}ms`);
    };
};
