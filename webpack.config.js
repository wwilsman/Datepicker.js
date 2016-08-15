let webpack = require('webpack')

module.exports = {
  entry: './index.js',
  output: {
    path: './dist',
    filename: 'datepicker.js',
    library: 'Datepicker',
    libraryTarget: 'umd'
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
