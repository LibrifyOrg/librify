import UIHandler from "@/ui/handler";
import WindowHandler from "@/ui/window";
import GameManager from "@/game/manager";
import ConfigManager from "@/config/manager";
import PluginManager from "@/plugin/manager";

export default class Application {
	constructor() {
		this.uiHandler = new UIHandler(this);
		this.windowHandler = new WindowHandler(this);
		this.configManager = new ConfigManager(this);
		this.pluginManager = new PluginManager(this);
		this.gameManager = new GameManager(this);
	}

	async start() {
		await this.pluginManager.loadAll();
		await this.gameManager.initialize();
		this.uiHandler.startRendering();
	}

	async stop() {
		this.gameManager.save();
	}
}