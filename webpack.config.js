const os = require('os');
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  devtool: 'source-map',
  entry: {
    bundle: ['babel-polyfill', './src/CordovaApp.js']
  },
  output: {
    path: path.join(__dirname, 'www'),
    publicPath: 'www/',
    filename: 'app.js'
  },
  externals: {
    'react-native-mauron85-background-geolocation': 'BackgroundGeolocation'
  },
  resolve: {
    extensions: ['.web.js', '.js', '.jsx', '.json'],
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules')
    ],
    alias: {
      // 'react': 'preact-compat',
      // 'react-dom': 'preact-compat',
      'native-base': 'native-base-web/index.js', // do not rely on pkg compiled rather compile ourself
      'react-native': 'react-native-web/src/index.js', // do not rely on pkg compiled rather compile ourself
      'react-native-vector-icons/Ionicons':
        'native-base-web/src/Components/Widgets/Icon',
      'react-native-maps': path.resolve(
        __dirname,
        'src', 'components', 'react-google-maps'
      )
    }
  },
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')]
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
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.join(__dirname, 'src'), // important for performance!
          /native-base-web/, // we need to compile from sources because not installed from npm
          /react-native-web/ // we need to compile from sources because not installed from npm
        ],
        // exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            query: { cacheDirectory: true }
          }
        ]
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
