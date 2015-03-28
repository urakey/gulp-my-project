'use strict';

var path    = require('path')
  , webpack = require('webpack')
  , current = process.cwd()
  ;

module.exports = {
  resolve: {
    root: [
      path.join(current, 'assets/scripts/components')
    , path.join(current, 'bower_components')
    ]
  , extensions: ['', '.js']
  }
, plugins: [
      new webpack.ResolverPlugin(
          new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])
      )
    , new webpack.optimize.DedupePlugin()
    , new webpack.optimize.AggressiveMergingPlugin()
    , new webpack.ProvidePlugin({
          jQuery: 'jquery'
        , jquery: 'jquery'
        , $:      'jquery'
      })
  ]
};
