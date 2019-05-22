module.exports = app => {
    const { router, controller, middleware } = app;
    const mockData = middleware.mockData();
    router.all('/proxy*', mockData, controller.api.index);
    router.get('/*.html', controller.page.index);
};