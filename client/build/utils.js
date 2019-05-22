const path = require('path');
const config = require('../config');
const packageConfig = require('../package.json');
const resolve = (dir) => {
    return path.resolve(__dirname, '..', dir)
};
const assetsPath = (_path) => {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory;

  return path.posix.join(assetsSubDirectory, _path);
};
const createNotifierCallback = () => {
  const notifier = require('node-notifier');

  return (severity, errors) => {
    if (severity !== 'error') return;

    const error = errors[0];
    const filename = error.file && error.file.split('!').pop();

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
    });
  };
};

module.exports = {
    resolve,
    assetsPath,
    createNotifierCallback
};
