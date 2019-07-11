const imageSizes = require("./images-sizes");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const OptiImageWebpackPlugin = require("opti-image-webpack-plugin");

module.exports = {
  css: { extract: false },
  configureWebpack: {
    plugins: [
      new ImageminWebpWebpackPlugin({
        config: [
          {
            test: /\.(jpe?g|png)/,
            options: {
              quality: 75
            }
          }
        ]
      }),
      new OptiImageWebpackPlugin({
        config: [
          {
            test: /\.(jpe?g|png|webp)/,
            options: {
              sizes: [1024, 768, 400],
              quality: 50
            }
          }
        ]
      })
    ]
  }
};
