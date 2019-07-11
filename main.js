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
	window.loadFile("index.html");
	window.once("ready-to-show", () => {
		window.show();
	});
})