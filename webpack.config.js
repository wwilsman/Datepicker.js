let webpack = require('webpack')

module.exports = {
  entry: './src',
  output: {
    path: './dist',
    filename: 'datepicker.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/,
      include: __dirname,
    }],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
}
