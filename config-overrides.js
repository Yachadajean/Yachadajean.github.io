// config-overrides.js
const { override } = require('react-app-rewired');
const { InjectManifest } = require('workbox-webpack-plugin');
const path = require('path');

module.exports = override(
  (config) => {
    config.plugins = config.plugins.filter(
      (plugin) => plugin.constructor.name !== 'GenerateSW'
    );

    config.plugins.push(
      new InjectManifest({
        swSrc: path.join(__dirname, 'src/firebase-messaging-sw.js'), // ✅ matches your current file path
        swDest: 'firebase-messaging-sw.js',
      })
    );

    return config;
  }
);
