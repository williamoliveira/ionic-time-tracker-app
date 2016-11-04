/* global __dirname */

// Dependencies
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (options) {

  var outputPath = path.resolve(__dirname, './www');
  var srcDir = path.resolve(__dirname, './app');
  var servePath = path.resolve(__dirname, './.tmp');

  var webpackConfig = {
    debug: true,
    entry: {
      app: path.join(srcDir, 'app.js')
    },
    //devtool: 'eval', //sourcemap, eval ...
    output: {
      path: outputPath,
      filename: '[name].js'
    },
    module: {

      noParse: '/node_modules/',

      loaders: [

        // Src JS
        {
          test: /\.js$/,
          loaders: ['ng-annotate', 'babel'],
          include: [srcDir]
        },

        //CSS
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
        },

        // LESS
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
        },

        // HTML Cached (concatenet in js)
        {
          test: /\.tpl.html$/,
          loader: 'ngtemplate?relativeTo=' + srcDir + '/!html'
        },

        // HTML
        {
          test: /\.tpl-ajax.html$/,
          loader: 'file-loader?name=tpls/[name].[ext]'
        },

        // Fonts
        {
          test: /\.(woff|woff2|svg|ttf|eot)([\?]?.*)$/,
          loader: 'file-loader?name=fonts/[name].[ext]'
        },

        // Static Imgs
        {
          test: /\.jpe?g$|\.gif$|\.png$|\.ico$/,
          loader: 'file-loader?name=imgs/[name].[ext]'
        },

        // json
        {
          test: /\.json$/,
          loader: 'json-loader'
        },

        // Exports
        {
          test: /[\/]angular\.js$/,
          loader: 'exports?angular'
        },
        {
          test: /[\/]ionic\.js$/,
          loader: 'exports?ionic'
        },

        // SET IDIOTIC IONIC CONFIG
        {
          test: /ionic\.io\.bundle\.js$/,
          loader: 'string-replace',
          query: {
            search: '"IONIC_SETTINGS_STRING_START";"IONIC_SETTINGS_STRING_END";',
            replace: 'var settings = ' + (fs.readFileSync(".io-config.json", "utf8")) + ';' +
            'return { get: function(setting) { if (settings[setting]) { return settings[setting];} return null; } };'
          }
        }
      ]
    },

    resolve: {
      root: [
        path.join(__dirname, 'app'),
        path.join(__dirname, 'bower_components'),
        path.join(__dirname, 'node_modules')
      ],
      moduleDirectories: [
        'bower_components',
        'node_modules'
      ]
    },
    plugins: [

      // Bower
      new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
      ),

      //Remove duplicates
      new webpack.optimize.DedupePlugin(),

      //// Separete vendors to a vendors.js file
      //new webpack.optimize.CommonsChunkPlugin({
      //  name: 'vendor',
      //  filename: 'vendor.js',
      //  minChunks: function (module) {
      //    return module.resource && module.resource.indexOf(srcDir) === -1;
      //  }
      //}),

      new ExtractTextPlugin('app.css'),

      new HtmlWebpackPlugin({
        pkg      : require('./package.json'),
        template : 'app/index.html'
      })

    ],
    devServer: {
      contentBase: servePath,
      noInfo: false, //  --no-info option
      hot: false
    }
  };

  if (options.production) {
    webpackConfig.debug = false;
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
  }

  return webpackConfig;

};
