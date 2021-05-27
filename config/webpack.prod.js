const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = function (env) {
  return merge(common(env), {
    optimization: {
      minimizer: [
        new TerserJSPlugin({}),
        new OptimizeCSSAssetsPlugin({})
      ],
      splitChunks: {
        minSize: 0,
        cacheGroups: {
          vendors: {
            name: "vendors",
            chunks: "all",
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      },
      runtimeChunk: { name: 'manifest' }
    },
    plugins: [
      // 提取css为独立的文件
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:7].css',
        chunkFilename: '[id].[contenthash:7].css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(le|c)ss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", 'postcss-loader', "less-loader"]
        }
      ]
    }
  });
}