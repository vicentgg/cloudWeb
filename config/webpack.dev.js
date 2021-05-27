const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = function (env) {
  return merge(common(env), {
    devtool: 'inline-source-map',
    devServer: {
      // hotOnly: true,
      hot: true,
      contentBase: '../dist',
      // port: 9000
      proxy: {
        '/jeecg-boot/': {
          target: 'http://115.236.69.27:8010',
          changeOrigin: true
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.(le|c)ss$/,
          use: ["style-loader", "css-loader", 'postcss-loader', "less-loader"]
        },
      ]
    }
  });
}