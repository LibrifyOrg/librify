const merge = require("webpack-merge");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpackBaseConfig = require("./webpack.base.conf");

module.exports = merge(webpackBaseConfig, {
	mode: "production",
	plugins: [
		new UglifyJsPlugin({
			test: /\.js($|\?)/i,
			sourceMap: true,
			uglifyOptions: {
				compress: true
			}
		})
	]
});