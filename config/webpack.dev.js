const WebpackMerge = require('webpack-merge');
const common = require('./webpack.common');
const Webpack = require('webpack');

module.exports = WebpackMerge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		open: false,
		https: false,
		hot: false,
    host: '0.0.0.0',
		port: process.env.PORT,
		compress: false,
		headers: {},
		proxy: {
			// '/storage': {
			// 	target: 'http://localhost:9527'
			// }
		},
		before(app) {}, /* eslint-disable-line */
		after(app) {}, /* eslint-disable-line */
	},
	plugins: [
		new Webpack.HotModuleReplacementPlugin()
	]
});
