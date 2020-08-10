'use strict';
process.env.NODE_ENV = 'production';
const chalk = require('chalk');
const webpack = require('webpack');
const webpackConfig = require('./webpack.prod.config');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

console.log(chalk.green('Production build start\n'));
webpackConfig.plugins.push(new ProgressBarPlugin({
    format: '  build [:bar] ' + chalk.green.bold(':percent') + chalk.yellow.bold(' (:elapsed seconds)'),
    clear: false
}));
webpack(webpackConfig, (err, stats) => {
    if (err) throw err;
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: true, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
        chunks: false,
        chunkModules: false
    }) + '\n\n');

    if (stats.hasErrors()) {
        console.log(chalk.red('Production build failed with errors.\n'));
        process.exit(1);
    }

    console.log(chalk.cyan('Production build complete.\n'));
    console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    ));
});
