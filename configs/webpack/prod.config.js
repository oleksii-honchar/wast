const TerserPlugin = require('terser-webpack-plugin');

console.log("[config:webpack:snippet] 'Production' loaded");

module.exports = {
  optimization: {
    minimize: false,
    // minimizer: [new TerserPlugin()],
  }
};
