const path = require("path");
const electron = require("electron");
const {app, BrowserWindow} = electron;

app.on("ready", () => {
	const window = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		width: 2100,
		height: 900,
		show: false,
		frame: false
	});

	window.setMenu(null);
	window.loadFile(path.join(__dirname, "dist/index.html"));
	window.webContents.openDevTools();
	window.once("ready-to-show", () => {
		window.show();
	});
})