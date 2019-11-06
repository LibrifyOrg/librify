const merge = require("webpack-merge");
const webpackBaseConfig = require("./webpack.base.conf");

module.exports = merge(webpackBaseConfig, {
	mode: "development",
	watch: true,
	watchOptions: {
		ignored: ["src", "node_modules"]
	}
});