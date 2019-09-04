const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  devtool: 'source-map',
  entry: {
    'app': [
      'react-hot-loader/patch',
      './example/index.js'
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env', 
            '@babel/preset-react'
          ],
          plugins: [
            'react-hot-loader/babel'
          ]
        }
      }]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './example/index.html'
    })
  ],
  devServer: {
    hot: true,
    progress: true,
    historyApiFallback: true,
    port: 3000
  }
}

module.exports = config
