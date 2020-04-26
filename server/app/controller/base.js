const { Controller } = require('egg');
class BaseController extends Controller {
    success (result) {
        this.ctx.body = {
            ...result,
        };
    }
    error (result) {
        this.ctx.body = {
            ...result
        };
    }
    notFound (msg) {
        msg = msg || 'not found';
        this.ctx.throw(404, msg);
    }
}
module.exports = BaseController;