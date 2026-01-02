/**
 * Note: For web builds, use Expo's built-in web support:
 * npm run web
 * 
 * This webpack config is provided as an alternative if you want
 * a custom web build setup. You'll need to install webpack dependencies:
 * npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin ts-loader
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './web/index.tsx',
  output: {
    path: path.resolve(__dirname, '../web-build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      'react-native$': 'react-native-web',
      // Alias web-specific implementations
      '../utils/storage$': path.resolve(__dirname, './storage.ts'),
      '../utils/soundManager$': path.resolve(__dirname, './soundManager.ts'),
      '../utils/adManager$': path.resolve(__dirname, './adManager.ts'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, './tsconfig.json'),
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp3|wav)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]',
        },
      },
      {
        test: /\.ttf$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './web/index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, '../web-build'),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
};

