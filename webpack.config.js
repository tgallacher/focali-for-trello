const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const packageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Main Webpack Config
 */
module.exports = {
  mode: process.env.NODE_ENV,
  devtool: isProduction ? 'cheap-source-map' : 'inline-cheap-source-map',
  entry: {
    content: './src/content.ts',
    popup: './src/popup.tsx',
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
    modules: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'assets'),
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        enforce: 'pre',
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'eslint-loader',
            options: {
              configFile: '.eslintrc.js',
              emitWarning: true,
              failOnError: false, // disable until ESLint w/TS is fixed
            },
          },
        ],
      },
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        // TODO is this required?
        test: /\.(je?pg|png|gif|svg)$/i,
        loaders: [
          {
            loader: 'url-loader',
            query: {
              limit: '100000',
              name: 'images/[name].[hash:10].[ext]',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // Boolean to help easily identify our current environment.
      ISPRODUCTION: isProduction,
    }),
    new CleanWebpackPlugin(['dist']),
    // Copy Extension Manifest file
    new CopyWebpackPlugin([
      {
        from: './src/manifest.tpl.json',
        to: 'manifest.json',
        transform: content => {
          const manifest = JSON.parse(content);

          /**
           * Keep extension version inline with package version.
           */
          manifest.version = packageJSON.version;
          // Add a 'random' version suffix to easily
          // see changes between builds during prod-in-test runs.
          if (!isProduction) {
            manifest.version = `${
              packageJSON.version
            }.${new Date().getMilliseconds()}`;
          }

          return JSON.stringify(manifest);
        },
      },
    ]),
    // Copy the images folder and optimize all the images
    // new CopyWebpackPlugin([
    //   {
    //     from: './src/images/',
    //     to: 'assets/images',
    //   },
    // ]),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
    }),
    new HTMLWebpackPlugin({
      title: 'Focali for Trello',
      filename: 'popup.html', // output filename
      template: './src/popup.tpl.html',
      chunks: ['popup'], // Only include the right chuncks
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  output: {
    filename: 'assets/scripts/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
