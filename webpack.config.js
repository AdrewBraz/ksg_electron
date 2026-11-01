const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const { dependencies } = require('./package.json');

module.exports = (env = {}, argv = {}) => {
  const mode = argv.mode || (env.production ? 'production' : process.env.NODE_ENV) || 'development';
  const isProduction = mode === 'production';
  const common = (name, target) => ({
    name,
    mode,
    target,
    context: __dirname,
    devtool: isProduction ? false : 'source-map',
    cache: {
      type: 'filesystem',
      name: `${name}-${mode}`,
      buildDependencies: {
        config: [__filename, path.resolve(__dirname, '.babelrc'),
          path.resolve(__dirname, 'postcss.config.js'), path.resolve(__dirname, 'package-lock.json')],
      },
    },
    resolve: { extensions: ['.js', '.jsx', '.json'] },
    stats: 'errors-warnings',
  });
  const styles = (sass = false) => [
    MiniCssExtractPlugin.loader,
    { loader: 'css-loader', options: { importLoaders: sass ? 2 : 1, sourceMap: !isProduction } },
    { loader: 'postcss-loader', options: { sourceMap: !isProduction } },
    ...(sass ? [{ loader: 'sass-loader', options: { sourceMap: !isProduction } }] : []),
  ];

  return [
    {
      ...common('renderer', 'electron-renderer'),
      entry: { ui: './src/renderer/index.js' },
      output: {
        filename: '[name]-bundle.js',
        path: path.resolve(__dirname, 'dist/renderer'),
        clean: true,
      },
      plugins: [
        new MiniCssExtractPlugin({ filename: '[name].css' }),
        new CopyPlugin({ patterns: [{ from: 'src/renderer/index.html', to: 'index.html' }] }),
      ],
      module: {
        rules: [
          { test: /\.css$/, use: styles() },
          { test: /\.(scss|sass)$/, use: styles(true) },
          { test: /\.jsx?$/, include: path.resolve(__dirname, 'src/renderer'), loader: 'babel-loader' },
        ],
      },
    },
    {
      ...common('main', 'electron-main'),
      entry: { main: './src/main/index.js' },
      output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/main'),
        clean: true,
      },
      // Electron/Node loads runtime packages, including native Oracle binaries, from node_modules.
      externals: [({ request }, callback) => {
        const packageName = request && request.split('/').slice(0, request.startsWith('@') ? 2 : 1).join('/');
        if (Object.prototype.hasOwnProperty.call(dependencies, packageName)) {
          return callback(null, `commonjs ${request}`);
        }
        return callback();
      }],
      plugins: [
        new CopyPlugin({ patterns: [{ from: 'src/main/locales', to: 'locales' }] }),
      ],
    },
    {
      ...common('preload', 'electron-preload'),
      entry: { ui: './src/preload/index.js' },
      output: {
        filename: '[name]-bundle.js',
        path: path.resolve(__dirname, 'dist/preload'),
        clean: true,
      },
    },
  ];
};
