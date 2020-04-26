module.exports = app => {
    const { router, controller, middleware } = app;
    const timeMonitor = middleware.timeMonitor();
    router.all('/proxy*', timeMonitor, controller.api.index);
    router.get('/*.html', timeMonitor, controller.page.index);
};