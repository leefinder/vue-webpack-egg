const _del = require('del');
const pluginName = {
    name: 'clean-source-map-webpack-plugin'
};
class CleanSourceMapWebpackPlugin {
    constructor (options) {
        const defaultOptions = {
            sourceMapPath: [],
            dangerouslyAllowCleanPatternsOutsideProject: false
        };
        this.options = Object.assign(defaultOptions, options);
        this.outputPath = '';
    }
    handleDone () {
        const { sourceMapPath, dangerouslyAllowCleanPatternsOutsideProject } = this.options;
        const { outputPath } = this;
        try {
            _del.sync(sourceMapPath.map(item => {
                return outputPath + '\\' + item;
            }), { force: dangerouslyAllowCleanPatternsOutsideProject });
            console.log('clean-source-map-webpack-plugin: complated');
        } catch (error) {
            const needsForce = /Cannot delete files\/folders outside the current working directory\./.test(error.message);
            if (needsForce) {
                const message = 'clean-source-map-webpack-plugin: Cannot delete files/folders outside the current working directory. Can be overridden with the `dangerouslyAllowCleanPatternsOutsideProject` option.';
                throw new Error(message);
            }
            throw error;
        }
    }
    apply (compiler) {
        if (!compiler.options.output || !compiler.options.output.path) {
            console.warn('clean-source-map-webpack-plugin: options.output.path not defined. Plugin disabled...');
            return;
        }
        const { sourceMapPath } = this.options;
        if (sourceMapPath.length === 0) {
            console.warn('clean-source-map-webpack-plugin: please input sourceMapPath. Plugin disabled...');
            return;
        }
        const { hooks } = compiler;
        this.outputPath = compiler.options.output.path;
        if (hooks) {
            hooks.done.tap(pluginName, stats => {
                this.handleDone();
            });
        } else {
            compiler.plugin('done', stats => {
                this.handleDone();
            });
        }
    }
}
module.exports = CleanSourceMapWebpackPlugin;
