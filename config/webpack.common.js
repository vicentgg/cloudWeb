const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const glob = require('glob');

const resolve = function (dir) {
  return path.resolve(__dirname, dir);
}

const setMPA = function () {
  let entry = {};
  let entryHtml = [];
  let htmlWebpackPlugins = [];

  // 返回匹配文件的文件地址数组
  let entryFiles = glob.sync(resolve('../src/pages/*/index.js'));

  entryFiles.map(function (item) {
    const match = item.match(/src\/pages\/(.*)\/index\.js/);
    const entryName = match ? match[1] : '';  // 获取文件对应名字

    entry[entryName] = item;
    entryHtml.push(`${entryName}.html`);
    htmlWebpackPlugins.push(
      new htmlWebpackPlugin({
        template: resolve(`../src/pages/${entryName}/index.html`),
        filename: `${entryName}.html`,
        // favicon: resolve('../favicon.ico'),
        chunks: [entryName, 'vendors', 'manifest'],
        minify: {
          html5: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true
        }
      })
    )
  })

  return {
    entry,
    entryHtml,
    htmlWebpackPlugins
  }

};

const { entry, htmlWebpackPlugins, entryHtml } = setMPA();

module.exports = function (env = {}) {
  return {
    mode: env.production ? 'production' : 'development',
    entry: entry,
    output: {
      filename: !env.production ? '[name].[hash:8].js' : '[name].[contenthash:8].js',
      path: path.resolve(__dirname, '../dist'),
      publicPath: ''
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          test: /\.html$/,
          use: {
            loader: "html-loader",
            options: {
              interpolate: "require"
            }
          }
        },
        {
          test: /\.(png|jp?g|gif|svg|ico)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                name: !env.production ? 'images/[name].[ext]' : 'images/[name].[contenthash:8].[ext]',
                esModule: false,
                publicPath: ''
              }
            },
          ]
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 8092,
                name: !env.production ? "media/[name].[ext]" : "media/[name].[contenthash:8].[ext]"
              }
            }
          ]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 8092,
                name: !env.production ? "font/[name].[ext]" : "font/[name].[contenthash:8].[ext]"
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin([
        { from: resolve('../src/skin'), to: './skin' }
      ]),
      ...htmlWebpackPlugins,
      new HtmlWebpackTagsPlugin({
        tags: [
          'https://unpkg.com/axios/dist/axios.min.js'
        ],
        append: false
      }),
    ],
    resolve: {
      alias: {
        '_pages': resolve('../src/pages'),
        '_skin': resolve('../src/skin'),
        '_utils': resolve('../src/utils'),
      }
    }
  }
}