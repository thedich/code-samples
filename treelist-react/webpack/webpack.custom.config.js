let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let WebpackShellPlugin = require('webpack-shell-plugin');
let autoprefixer = require('autoprefixer');
let Path = require('path');

module.exports = function(options) {
	let fileLoader = {
		loader: 'file-loader',
		options: {
			name: '[name].[ext]',
            outputPath: 'static/assets/',
            publicPath: '../assets'
		}
	};

	let plugins = [
		new ExtractTextPlugin({
			filename: './static/css/style.css'
		})
	];

	if ( options.showProgress ) {
		plugins.push(new webpack.ProgressPlugin());
	}

	if ( options.production ) {
		plugins.push(
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: '"production"'
				}
			}),

			new webpack.optimize.UglifyJsPlugin({
				sourceMap: options.sourceMap,
				comments: !options.cutComments,
				compress: {
					warnings: false,
					drop_console: options.dropConsole
				}
			})
		);

		if ( options.zipFolder ) {
			plugins.push(
				new WebpackShellPlugin({
					onBuildStart: ['rm -rf -f dist/' + options.distFolder + ' && rm -f dist/' + options.distFolder + '.zip'],
					onBuildEnd: ['zip -X -r -q dist/' + options.distFolder + '.zip dist/' + options.distFolder]
				})
			);
		}
	}

	return {
		entry: ['babel-polyfill', __dirname + '/' + options.siteName + '.js'],
		output: {
			path: Path.resolve(__dirname, '../dist', options.distFolder),
			filename: './static/js/main.js'
		},
		devtool: options.sourceMap ? 'source-map' : false,
		devServer: {
			host: '0.0.0.0',
			port: options.devServerPort,
            headers: { "Access-Control-Allow-Origin": "*" },
			inline: false,
			stats: {
				hash: true,
				version: true,
				timings: true,
				assets: false,
				chunks: false,
				modules: false,
				reasons: false,
				children: false,
				source: false,
				errors: true,
				errorDetails: true,
				warnings: true
			}
		},
		resolve: {
			modules: ['node_modules', 'ts'],
			extensions: ['.ts', '.tsx', '.js']
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/
				},
				{
					test: /\.sass$/,
					use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								options: {
									sourceMap: options.sourceMap
								}
							},
							{
								loader: 'postcss-loader',
								options: {
									plugins: [autoprefixer({ browsers: ['last 2 versions', '> 5%'] })],
									sourceMap: options.sourceMap
								}
							},
							{
								loader: 'sass-loader',
								options: {
									sourceMap: options.sourceMap
								}
							}
						]
					})
				},
				{
                    test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?.*$|$)/,
					use: fileLoader
				}
			]
		},
		plugins: plugins
	}
};