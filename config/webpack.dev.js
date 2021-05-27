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
      proxy: { //数据地址
        // '/jeecg-boot/': {
        //   target: '', //ip地址
        //   changeOrigin: true
        // }
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