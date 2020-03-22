const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

console.log("[config:webpack:snippet] 'Base' loaded");

const pkg = require("../../package.json");

module.exports = (env) => {
  console.log(`[config:webpack:snippet] 'Base' processing config`);

  return {
    name: "test",
    mode: process.env.NODE_ENV,
    cache: true,
    target: "node",
    devtool: process.env.NODE_ENV === "production" ? false : "inline-source-map",
    entry: {
      app: './src/index.ts',
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
        modules: [
        "src",
        "node_modules",
      ],
      plugins: [
        new TsConfigPathsPlugin({
          configFile: path.join(__dirname, `../tsconfig.json`),
          logLevel: "info"
        })
      ]
    },
    output: {
      path: path.join(__dirname, "../../dist"),
      filename: `[name].bundle.js`,
      sourceMapFilename: `[name].map`,
      publicPath: "/",
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
      new LodashModuleReplacementPlugin(),
      new CopyWebpackPlugin([
        {
          from: "./src/assets",
          to: ".",
          ignore: [ "*.hbs", ".DS_Store" ],
        }
      ])
    ],
    node: {
      fs: 'empty',
      global: true,
      crypto: 'empty',
      process: true,
      console: true,
      module: false,
      clearImmediate: false,
      setImmediate: false,
      __dirname: false,
      __filename: false
    },
    watchOptions: {
      aggregateTimeout: 3000,
    }
  }
};
