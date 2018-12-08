const WebpackMerge = require('webpack-merge');
const common = require('./webpack.common');
const Webpack = require('webpack');

module.exports = WebpackMerge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		open: false,
		https: false,
		hot: true,
		port: 3030,
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
