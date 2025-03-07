const path = require('path');

module.exports = {
  entry: './compute.js',
  target: 'webworker',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'bin'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['last 2 versions'],
                  esmodules: true
                }
              }]
            ]
          },
        },
      },
    ],
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
      crypto: false
    }
  },
  optimization: {
    minimize: false
  }
};