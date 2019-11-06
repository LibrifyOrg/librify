const path = require("path");
const electron = require("electron");
const {app, BrowserWindow, globalShortcut} = electron;

try {
	require('electron-reload')(path.join(__dirname, "dist/"), {
		electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
	});
} catch {}

app.on("ready", () => {
	const window = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		width: 1800,
		height: 900,
		show: false,
		frame: false
	});

	window.setMenu(null);
	window.loadFile(path.join(__dirname, "dist/index.html"));
	window.once("ready-to-show", () => {
		window.show();
	});

	globalShortcut.register("F3", () => {
		window.webContents.toggleDevTools();
	})
});