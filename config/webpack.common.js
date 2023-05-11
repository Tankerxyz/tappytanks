const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const devMode = process.env.NODE_ENV === 'development';

console.log(process.env, process.env.NODE_ENV);

module.exports = {
	entry: {
		app: path.resolve(__dirname, '../src/index.ts'),
	},
	output: {
		filename: '[name].[hash].js',
		// chunkFilename: '[name].bundle.js',
		path: path.resolve(__dirname, '../dist')
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader'
			},
			{
				test: /\.(png|svg|jpe*g|gif|obj|mtl|mp3|ogg|ttf|woff|woff2|ico)$/, // obj | mtl raw files etc...
				use: [
					{
						loader: 'file-loader',
						options: {
							name() {
								return devMode ? '[path][name].[ext]' : '[hash].[ext]';
							},
							outputPath: devMode ? '' : 'src/'
						}
					}
				]
			},
			{
				test: /\.html$/i,
				use: [
					{
						loader: 'html-loader',
						options: {
							minimize: !devMode
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	plugins: [
		new CleanWebpackPlugin(['dist'], {
			root: path.resolve(__dirname, '../')
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../src/index.html'),
			// favicon: path.resolve(__dirname, '../src/favicon.ico'),
		}),
    new DotenvPlugin({
      path: path.resolve(__dirname, `../.env`),
    }),
    new CopyWebpackPlugin([{
      from: 'src/models', to: 'models'
    }])
	],
	optimization: {
		namedChunks: true,
		splitChunks: {
			name: 'vendor',
			filename: 'common.[hash].js',
			chunks: 'all',
			cacheGroups: {
				commons: {
					name: 'commons',
					chunks: 'initial',
					minChunks: 4
				}
			}
		}
	}
};
