const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  mode: 'production',
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/config' }
    ])
  ]
}

module.exports = config;