const BaseController = require('./base');
class PageController extends BaseController {
    async index () {
        const { ctx } = this;
        await ctx.render(ctx.path);
    }
}
module.exports = PageController;