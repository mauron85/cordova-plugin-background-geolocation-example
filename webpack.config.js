const os = require('os');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const paths = {
  appSrc: resolveApp('src'),
  appNodeModules: resolveApp('node_modules'),
};

const config = {
  devtool: 'source-map',
  entry: {
    bundle: ['babel-polyfill', './src/CordovaApp.js']
  },
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'app.js'
  },
  externals: {
    'react-native-mauron85-background-geolocation': 'BackgroundGeolocation'
  },
  resolve: {
    extensions: ['.web.js', '.js', '.jsx', '.json'],
    modules: [
      paths.appSrc,
      paths.appNodeModules
    ],
    alias: {
      'react-native/Libraries/Renderer/shims/ReactNativePropRegistry': 'react-native-web/dist/modules/ReactNativePropRegistry',
      'react-native': path.resolve(__dirname, 'src', 'lib', 'react-native-web-extended'),
      'react-native-maps': path.resolve(__dirname, 'src', 'lib', 'react-google-maps'),
      'native-base': path.resolve(__dirname, 'src', 'lib', 'native-base-extended'),
    }
  },
  resolveLoader: {
    modules: [paths.appNodeModules]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  module: {
    rules: [{
        test: /\.jsx?$/,
        include: [
          path.resolve(paths.appSrc), // important for performance!
          path.resolve(paths.appNodeModules, 'native-base-shoutem-theme'),
          path.resolve(paths.appNodeModules, 'react-navigation'),
          path.resolve(paths.appNodeModules, 'react-native-easy-grid'),
          path.resolve(paths.appNodeModules, 'react-native-drawer'),
          path.resolve(paths.appNodeModules, 'react-native-safe-area-view'),
          path.resolve(paths.appNodeModules, 'react-native-vector-icons'),
          path.resolve(paths.appNodeModules, 'react-native-keyboard-aware-scroll-view'),
          path.resolve(paths.appNodeModules, 'react-native-iphone-x-helper'),
          path.resolve(paths.appNodeModules, 'react-native-web'),
          path.resolve(paths.appNodeModules, 'react-native-tab-view'),
          path.resolve(paths.appNodeModules, 'static-container'),
          path.resolve(paths.appNodeModules, 'color')
        ],
        // exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          query: {
            cacheDirectory: true
          }
        }]
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.woff$/,
        loader: 'url-loader',
        options: {
          limit: 150000
        }
      },
      {
        test: /\.(ttf|eot|svg|woff2)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpe?g)$/,
        loader: 'url-loader',
        options: {
          limit: 150000
        }
      }
    ]
  }
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      parallel: true,
      sourceMap: true,
      compress: {
        drop_console: false,
        warnings: false
      }
    })
  );
}

module.exports = config;