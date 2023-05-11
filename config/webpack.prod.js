const WebpackMerge = require('webpack-merge');
const common = require('./webpack.common');
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');
const { EnvironmentPlugin } = require('webpack')

module.exports = WebpackMerge(common, {
	mode: 'production',
	optimization: {
		minimizer: [
			new UglifyJSWebpackPlugin({
				uglifyOptions: {
					ie8: false,
					compress: true,
					mangle: true,
					warnings: false,
					parallel: true,
					cache: true,
					sourceMap: true
				}
			}),
		]
	},
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      API_URI: process.env.API_URI,
      API_WS_URI: process.env.API_WS_URI,
    }),
  ]
});
