const webpackMerge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// Short usage reference
// `NODE_ENV` = development | test | production
// `LOG_LEVEL` = error | warn | info | debug
const pkg = require('../package.json');

const baseCfg = require('./webpack/base.config');
const moduleCfg = require('./webpack/module.config');
const prodCfg = require('./webpack/prod.config');

console.log(`[config:webpack] "${pkg.name}" config composition started`);

module.exports = (env) => {
  env = env ? env : {};
  env.BUILD_ANALYZE = env.BUILD_ANALYZE ? env.BUILD_ANALYZE : null;

  console.log(`[config:webpack] "${process.env.NODE_ENV}" mode used...`);

  let cfg = baseCfg(env);
  cfg = webpackMerge(cfg, moduleCfg(env));

  if (env.BUILD_ANALYZE === 'true') {
    console.log('[config:webpack] bundle analyzer included');

    cfg = webpackMerge(cfg, {
      plugins: [ new BundleAnalyzerPlugin() ]
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('[config:webpack] config composition completed');

    return cfg;
  }

  config = webpackMerge(cfg, prodCfg);

  console.log('[config:webpack] config composition completed');
  return config;
}
