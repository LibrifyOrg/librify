const webpack = require("webpack");
const path = require("path");
const NodeUtils = require("util");
const packager = require("electron-packager");
const webpackConfig = require("./webpack.prod.conf");

const packagerOptions = {
	dir: path.resolve(__dirname, "../"),
	out: path.resolve(__dirname, "../dist"),
	platform: "all"
};
let startTime = process.hrtime();

console.log("Building with webpack");

NodeUtils.promisify(webpack)(webpackConfig)
.then(() => {
	let endTime = process.hrtime(startTime);

	console.log("Build it successfully in %ds and %dms", endTime[0], endTime[1] / 1000000);
	startTime = process.hrtime();
	console.log("Building into executable");

	return packager(packagerOptions);
})
.then(() => {
	endTime = process.hrtime(startTime);
	console.log("Build it successfully in %ds and %dms", endTime[0], endTime[1] / 1000000);
})
.catch(err => {throw err});