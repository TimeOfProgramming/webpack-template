const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/'
}

const PAGES_DIR = `${PATHS.src}/public/`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));

module.exports = {

  externals: {
    paths: PATHS
  },
  entry: {
    app: PATHS.src,
    // module: `${PATHS.src}/your-module.js`,
  },
  output: {
    filename: `${PATHS.assets}js/[name].[hash].js`,
    path: PATHS.dist,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [{
      test: /\.pug$/,
      oneOf: [
        
        {
          resourceQuery: /^\?vue/,
          use: ['pug-plain-loader']
        },
        
        {
          use: ['pug-loader']
        }
      ]
    }, {
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
      exclude: '/node_modules/'
    },
    {
      enforce: 'pre',
      test: /\.(js|jsx)$/,
      loader: 'eslint-loader',
      exclude: '/node_modules/'
    }, 
     {
      test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader',
      options: {
        name: 'assets/fonts/[name].[ext]'
      }
    }, 
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'url-loader',
      options: {
        limit: 8192,
        name: 'assets/img/[name].[ext]'
      }
    }, 
    {
      test: /\.scss$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        }, 
        {
          loader: 'resolve-url-loader',
          options: { sourceMap: true }
        },
         {
          loader: 'sass-loader',
          options: { sourceMap: true }
        },
      ]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: true, config: { path: `postcss.config.js` } }
        }
      ]
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
},
 
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].[hash].css`,
    }),
    new CopyWebpackPlugin([
      { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
      { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
     
    ]),

  
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.pug/,'.html')}`
    }))
  ],
};
