import electron from "electron";
import UIHandler from "@/ui/handler";
import GameManager from "@/game/manager";
import ConfigManager from "@/config/manager";
import PluginManager from "@/plugin/manager";
import { EventEmitter } from "events";

export default class Application extends EventEmitter {
	constructor() {
		this.uiHandler = new UIHandler(this);
		this.configManager = new ConfigManager(this);
		this.pluginManager = new PluginManager(this);
		this.gameManager = new GameManager(this);
		this.electron = electron.remote;
	}

	async start() {
		await this.pluginManager.loadAll();
		await this.gameManager.initialize();
		this.uiHandler.startRendering();
		this.emit("start");
	}

	async stop() {
		this.gameManager.save();
		this.emit("stop");
	}
}