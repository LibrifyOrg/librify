import electron from "electron";

export default class WindowHandler {
	constructor() {
		this.window = electron.remote.getCurrentWindow();
	}
	
	close() {
		this.window.close();
	}

	minimize() {
		this.window.minimize();
	}

	maximize() {
		this.window.maximize();
	}

	isMaximized() {
		return this.window.isMaximized();
	}

	unmaximize() {
		this.window.unmaximize();
	}
}