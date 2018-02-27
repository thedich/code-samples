'use strict';

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require ('extract-text-webpack-plugin');

var plugins = [];
	plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress: { warnings: false },
			output:   { comments:false }
		})
	);


plugins.push(
    new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"})
);


module.exports = {
	devtool: 'source-map',
	entry:  ['./src/index.jsx'],
	output: { filename: './build/js/player.js' },
    resolve: { extensions: ["", ".js", '.jsx', ".css"] },
	plugins: plugins,
	module: {
        postLoaders: [ { loader: "transform/cacheable?brfs" }],
		loaders:
        [
			{
				test: /\.jsx$/,
				exclude: path.join(__dirname, 'node_modules'),
				loader: 'babel-loader',
                query: { presets: [ 'es2015' ] }
			},

            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader' , 'css-loader')
            }
		]
	}
};

plugins.push(new ExtractTextPlugin('./build/css/bundle.css'));
