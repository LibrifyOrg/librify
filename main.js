const path = require("path");
const electron = require("electron");
const {app, BrowserWindow} = electron;

app.on("ready", () => {
	const window = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		show: false
	});

	window.setMenu(null);
	window.loadFile(path.join(__dirname, "dist/index.html"));
	window.webContents.openDevTools();
	window.once("ready-to-show", () => {
		window.show();
	});
})