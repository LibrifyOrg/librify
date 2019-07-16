const webpack = require("webpack");
const webpackConfig = require("./webpack.prod.conf");

const startTime = process.hrtime();

console.log("Building the webapp");

webpack(webpackConfig, err => {
	if(err) throw err;

	const endTime = process.hrtime(startTime);

	console.log("Build it successfully in %ds and %dms", endTime[0], endTime[1] / 1000000);
});