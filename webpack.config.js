const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const chalk = require('chalk');

const packageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Read our (secrets) config file.
 */
const configResult = require('dotenv').config({
  path: `./.env.${process.env.NODE_ENV}`,
});

if (configResult.error) {
  throw configResult.error;
}

// These have to be set in our ENV
// otherwise strange things might happen during builds.
const reqEnvParams = ['FOCALI_KEY', 'FOCALI_CLIENTID'];
const envParams = Object.keys(process.env);
const missingEnvParams = reqEnvParams.filter(p => !envParams.includes(p));

if (missingEnvParams.length > 0) {
  missingEnvParams.map(pName => {
    //eslint-disable-next-line
    console.log(
      chalk.red(`The following ENV variable was not found: "${pName}"`),
    );
  });

  process.exit(11);
}

/**
 * Main Webpack Config
 */
module.exports = {
  mode: process.env.NODE_ENV,
  devtool: isProduction ? 'cheap-source-map' : 'inline-cheap-source-map',
  entry: {
    background: './src/background.ts',
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
           * @todo: This is temp; not sure if we need these content script.
           *        Might need one for the "full screen" feature.
           */
          if ('content_scripts' in manifest) {
            delete manifest.content_scripts;
          }

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

          /**
           * Enforce sync of our Oauth credentials for production.
           *
           * @see: https://console.cloud.google.com/apis/credentials
           */
          if (process.env.NODE_ENV === 'production') {
            manifest.key = process.env.FOCALI_KEY;
            manifest.oauth2.client_id = process.env.FOCALI_CLIENTID;
          }

          return JSON.stringify(manifest);
        },
      },
    ]),
    // Copy the images folder and optimize all the images
    new CopyWebpackPlugin([
      {
        from: './src/images/',
        to: 'assets/images',
      },
    ]),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
    }),
    new HTMLWebpackPlugin({
      title: 'Focali for Trello',
      filename: 'popup.html', // output filename
      template: './src/popup.tpl.html',
      chunks: ['popup'], // Only include the right chuncks
    }),
  ],
  output: {
    filename: 'assets/scripts/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
