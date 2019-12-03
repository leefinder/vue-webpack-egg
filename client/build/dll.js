'use strict';
process.env.NODE_ENV = 'production';

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const webpackDll = require('./webpack.dll.config');

const spinner = ora('Building for Dll...\n');
spinner.start();
const p = new Promise((resolve, reject) => {
    rm(path.join(config.build.assetsRoot), err => {
        if (err) {
            reject(err);
        } else {
            console.log(chalk.green('  public has removed\n'));
            resolve();
        }
    });
});
const v = new Promise((resolve, reject) => {
    rm(path.join(config.build.assetsIndex), err => {
        if (err) {
            reject(err);
        } else {
            console.log(chalk.green('  view has removed\n'));
            resolve();
        }
    });
});
Promise.all([p, v]).then(() => {
    console.log(chalk.green('Dll build start\n'));
    webpack(webpackDll, (err, stats) => {
        spinner.stop();
        if (err) throw err;
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
            chunks: false,
            chunkModules: false
        }) + '\n\n');

        if (stats.hasErrors()) {
            console.log(chalk.red('Dll build failed with errors.\n'));
            process.exit(1);
        }

        console.log(chalk.cyan('Dll build complete.\n'));
    });
});
