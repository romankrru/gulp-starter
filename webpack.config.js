const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  watch: true,
  entry: {
    index: './src/common/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
  ]
};
