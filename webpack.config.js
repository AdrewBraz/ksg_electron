const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path')

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

module.exports = [
  {
    mode: process.env.NODE_ENV || 'development',
    target: 'electron-renderer',
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    entry: {
      ui: './src/renderer/index.js',
    },
    output: {
      filename: '[name]-bundle.js',
      path: path.resolve(__dirname, 'dist/renderer')
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            { loader: 'css-loader', options: { importLoaders: 1, sourceMap: isDevelopment } },
            { loader: 'postcss-loader', options: { sourceMap: isDevelopment } },
          ],
        },
        {
          test: /\.(scss|sass)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            { loader: 'css-loader', options: { importLoaders: 1, sourceMap: isDevelopment } },
            { loader: 'postcss-loader', options: { sourceMap: isDevelopment } },
            { loader: 'sass-loader', options: { sourceMap: isDevelopment } },
          ],
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
  },
  {
    target: 'electron-main',
    entry: {
      renderrer: './src/main/index.js',
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist/main/')
    },
    plugins: [
        new CopyPlugin({
          patterns: [
            { from: path.resolve(__dirname, 'node_modules/oracledb/build'), to: "node_modules/oracledb/build" },
          ],
          options: {
            concurrency: 100,
          },
        })
      ],
    
    externals: ['mongodb-client-encryption']
  },
  {
    target: 'electron-preload',
    entry: {
      ui: './src/preload/index.js',
    },
    output: {
      filename: '[name]-bundle.js',
      path: path.resolve(__dirname, 'dist/preload/')
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              { loader: 'css-loader', options: { importLoaders: 1 } },
            ],
          },
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            },
          },
        ],
      }
  }
]
