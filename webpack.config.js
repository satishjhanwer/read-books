const path = require('path');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

process.env.BASE_PATH = process.env.BASE_PATH || '/';

const BASE_PATH = process.env.BASE_PATH;
const isProduction = process.env.NODE_ENV === 'production';
const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

const config = {
  mode: 'development',
  target: 'web',
  entry: [path.join(process.cwd(), 'app/app.js')],
  output: {
    path: path.resolve(process.cwd(), 'build'),
    publicPath: BASE_PATH,
    filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    chunkFilename: isProduction ? '[name].[chunkhash].chunk.js' : '[name].chunk.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html',
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.BASE_PATH': JSON.stringify(process.env.BASE_PATH),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: [stylesHandler, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [stylesHandler, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        include: /node_modules/,
        use: [stylesHandler, 'css-loader'],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        type: 'asset/inline',
      },
      {
        test: /\.(jpg|png|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(mp4|webm)$/,
        type: 'asset',
      },
      {
        test: /kcl/,
        resolve: { fullySpecified: false },
      },
      {
        test: /kcl\/\/\.(js|jsx)$/i,
        use: 'babel-loader',
      },
    ],
  },
  performance: {
    assetFilter: (assetFilename) => !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
    hints: 'warning',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
    config.plugins = [
      ...config.plugins,
      new MiniCssExtractPlugin(),
      new WorkboxWebpackPlugin.GenerateSW(),
      new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
      new CompressionPlugin({ test: /\.js$|\.css$|\.html$/, threshold: 10240, minRatio: 0.8 }),
    ];
    config.optimization.minimize = true;
    config.optimization.minimizer = [
      new TerserPlugin({ minify: TerserPlugin.swcMinify, exclude: /\/node_modules/, extractComments: false }),
    ];
    config.optimization.splitChunks = {
      cacheGroups: {
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'vendor-react',
          chunks: 'all',
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
            return packageName !== null ? `npm.${packageName[1].replace('@', '')}` : 'some-module';
          },
        },
      },
    };
  } else {
    config.devtool = 'eval-source-map';
    config.plugins = [
      ...config.plugins,
      new CircularDependencyPlugin({ exclude: /a\.js|node_modules|kcl/, failOnError: false }),
      new webpack.HotModuleReplacementPlugin(),
    ];
    // Adding Support for HMR
    config.entry = ['webpack-hot-middleware/client', ...config.entry];
  }
  return config;
};
