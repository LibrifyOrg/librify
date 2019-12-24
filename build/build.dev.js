const webpack = require("webpack");
const webpackConfig = require("./webpack.dev.conf");

const startTime = process.hrtime();

webpack(webpackConfig, err => {
	if(err) throw err;

	const endTime = process.hrtime(startTime);

	console.log("Build the webapp successfully %ds and %dms after start", endTime[0], endTime[1] / 1000000);
});