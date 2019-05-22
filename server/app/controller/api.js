const BaseController = require('./base');
class ApiController extends BaseController {
    async index () {
        const { ctx, service } = this;
        const { method, path, query } = ctx;
        const url = path.replace(/^\/proxy/, '');
        try {
            const result = await service.api.getData({
                url,
                method,
                data: query
            });
            ctx.body = {
                ...result
            };
        } catch (e) {
            ctx.body = {
                code: -1,
                data: null,
                message: '服务器异常'
            };
        }
    }
}
module.exports = ApiController;