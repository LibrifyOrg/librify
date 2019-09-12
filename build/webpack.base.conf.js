const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: ["babel-polyfill", "./resources/scss/stylesheet.scss", "./src/index.js"],
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "js/index.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /\/node_modules\//,
				loader: "babel-loader"
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'css/[name].css',
						}
					},
					"extract-loader",
					"css-loader",
					"sass-loader"
				]
			},
			{
				test: /\.ttf$/,
				loader: 'url-loader',
				options: {
					limit: 100000
				}
			},
			{
				test: /\.(jpe?g|gif|png|wav|mp3)$/, 
				loader: "file-loader"
			}
		],
		noParse: /native\.js$/
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html"
		})
	],
	externals: /^(plugins)$/i,
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "../src"),
			"$": path.resolve(__dirname, "../")
		}
	},
	target: "electron-renderer"
}