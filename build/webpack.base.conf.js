const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: ["./src/index.js", "./assets/scss/stylesheet.scss"],
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
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html"
		})
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "../src")
		}
	},
	target: "electron-renderer"
}