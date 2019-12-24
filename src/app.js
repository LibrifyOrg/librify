import electron from "electron";
import Logger from "@/logger";
import UIHandler from "@/ui/handler";
import GameManager from "@/game/manager";
import ConfigManager from "@/config/manager";
import PluginManager from "@/plugin/manager";
import {EventEmitter} from "events";

/**
 * This class is in control of the application, hence its name. It manages the references to all 
 * major classes (e.g. ui and games) and handles both startup and stopping the app.
 */
export default class Application extends EventEmitter {
	/** @ignore */
	constructor() {
		super();

		/** The electron member can be used to easily access electron. While this is also available 
		 * by just requiring electron, this is seen as a more logical and better to read option.
		 * @type {electron.Remote} */
		this.electron = electron.remote;
		/** This is a reference to the logger created by the Logger class, see {@link Logger} for 
		 * more information. 
		 * @type {winston.Logger} */ 
		this.logger = new Logger(this).create(); 
		/** This member references the ui handler, that handles everything to do with the ui, like 
		 * starting it.
		 * @type {UIHandler} */
		this.ui = new UIHandler(this);
		/** The configs member references the config manager, that as the name implies manages all 
		 * the configs.
		 * @type {ConfigManager} */
		this.configs = new ConfigManager();
		/** The plugins member is used as a reference for the plugin manager, that manages the 
		 * plugin as well as the installation, updating thereof. 
		 * @type {PluginManager} */
		this.plugins = new PluginManager(this);
		/** This manager, arguably the most important of them all, is used to reference the game 
		 * mananger, that is in charge of managing all the games.
		 * @type {GameManager} */
		this.games = new GameManager(this);
	}

	/**
	 * Starts, as its name implies, the application. Calling a hardcoded order of methods starting
	 * the application.
	 * @emits {started} when the application has been started
	 */
	async start() {
		this.logger.debug("starting application").timing("Application.start");

		await this.games.initialize();
		await this.plugins.loadAll();
		await this.plugins.enableAll();
		await this.games.findAll();
		this.ui.startRendering();
		this.emit("started");

		this.logger.info(`started application in ${this.logger.timing("Application.start")}`);
	}

	/**
	 * Stops the application. Just like the {@link Application.stop} method this method follows a 
	 * set of hardcoded methods when stopping the appliction.
	 * @emits {stop} before stopping the application
	 */
	async stop() {
		this.logger.debug("stopping application").timing("Application.start");

		this.emit("stop");
		await this.plugins.disableAll();
		await this.games.save();

		this.logger.info(`stopped application in ${this.logger.timing("Application.start")}`);
	}
}