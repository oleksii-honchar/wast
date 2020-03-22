const path = require("path");

console.log("[config:webpack:snippet] 'Module' loaded");

module.exports = (env) => {
  return {
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.[tj]sx?$/,
          use: "source-map-loader",
        },
        {
          test: /\.[tj]sx?$/,
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            configFile: path.join(__dirname, `../tsconfig.json`)
          },
          exclude: [
            /\.(spec|e2e|d)\.[tj]sx?$/
          ],
        }
      ],
      noParse: [
        /\.(spec|e2e|d)\.[tj]sx?$/,
        /LICENSE/,
        /README.md/,
      ]
    }
  }
};
