import electron from "electron";
import Logger from "@/logger";
import UIHandler from "@/ui/handler";
import GameManager from "@/game/manager";
import ConfigManager from "@/config/manager";
import PluginManager from "@/plugin/manager";
import {EventEmitter} from "events";

export default class Application extends EventEmitter {
	constructor() {
		super();

		this.electron = electron.remote;
		this.logger = new Logger(this).create();
		this.ui = new UIHandler(this);
		this.configs = new ConfigManager(this);
		this.plugins = new PluginManager(this);
		this.games = new GameManager(this);
	}

	async start() {
		this.logger.info("starting application").timing("Application.start");

		await this.games.initialize();
		await this.plugins.loadAll();
		await this.plugins.enableAll();
		await this.games.findAll();
		this.ui.startRendering();
		this.emit("start");

		this.logger.info(`started application in ${this.logger.timing("Application.start")}`);
	}

	async stop() {
		this.logger.info("stopping application").timing("Application.start");

		this.emit("stop");
		await this.games.save();

		this.logger.info(`stopped application in ${this.logger.timing("Application.start")}`);
	}
}