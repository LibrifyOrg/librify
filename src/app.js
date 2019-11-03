import electron from "electron";
import UIHandler from "@/ui/handler";
import GameManager from "@/game/manager";
import ConfigManager from "@/config/manager";
import PluginManager from "@/plugin/manager";
import { EventEmitter } from "events";

export default class Application extends EventEmitter {
	constructor() {
		super();

		this.electron = electron.remote;
		this.ui = new UIHandler(this);
		this.configs = new ConfigManager(this);
		this.plugins = new PluginManager(this);
		this.games = new GameManager(this);
	}

	async start() {
		await this.games.initialize();
		await this.plugins.loadAll();
		await this.games.findAll();
		this.ui.startRendering();
		this.emit("start");
	}

	async stop() {
		this.emit("stop");
		this.games.save();
	}
}