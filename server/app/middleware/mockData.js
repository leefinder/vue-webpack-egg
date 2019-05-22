const fs = require('fs');
const path = require('path');
const readFile = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (error, data) => {
            if (error) return reject(error);
            data = JSON.parse(data);
            resolve(data);
        });
    });
};
module.exports = () => {
    return async (ctx, next) => {
        const { path: cPath, app } = ctx;
        const { requestRoot } = app.config;
        if (!requestRoot && cPath.includes('proxy')) {
            const baseMock = 'mock';
            const url = cPath.replace(/^\/proxy/, '');
            const mockUrl = path.resolve(app.baseDir, `${baseMock}${url}.json`);
            const result = await readFile(mockUrl);
            ctx.body = result;
        } else {
            await next();
        }
    };
};
