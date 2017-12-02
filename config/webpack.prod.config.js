const webpack = require('webpack');
const path = require('path');

module.exports = {
  watch: false,
  entry: {
    index: path.join(__dirname, '../src/common/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
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
    new webpack.optimize.UglifyJsPlugin()
  ]
};
