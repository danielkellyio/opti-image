const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const OptiImageWebpackPlugin = require("opti-image-webpack-plugin");

module.exports = {
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
              sizes: [1200, 800, 400]
            }
          }
        ]
      })
    ]
  }
};
