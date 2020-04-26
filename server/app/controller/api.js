const BaseController = require('./base');
class ApiController extends BaseController {
    async index () {
        const { ctx, service } = this;
        let { method, path, query, params, request } = ctx;
        const { body } = request;
        const url = path.replace(/^\/proxy/, '');
        let data = {};
        switch (method) {
        case 'GET':
            data = query;
            break;
        case 'PUT':
            data = params;
            break;
        case 'POST':
            data = body;
            break;
        default:
            break;
        }
        try {
            const result = await service.api.asyncData({
                url,
                method,
                data
            });
            this.success(result);
        } catch (e) {
            ctx.logger.error(`异常信息:, ${e}`);
            this.error({
                code: -1,
                message: e || '服务器异常'
            });
        }
    }
}
module.exports = ApiController;