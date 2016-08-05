let webpack = require('webpack')

module.exports = {
  entry: {
    'datepicker': './src/datepicker.js',
    'datepicker.min': './src/datepicker.js',
  },
  output: {
    path: './dist',
    filename: '[name].js',
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
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/
    })
  ]
}
