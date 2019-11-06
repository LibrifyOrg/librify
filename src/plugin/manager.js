import fs from "fs";
import path from "path";
import util from "util";
import Plugin from "@/plugin/model";
import native from "@/native";

export default class PluginManager extends Map {
	constructor(app) {
		super();

		this.app = app;
		this.folder = path.resolve("plugins/");
	}

	async loadAll() {
		this.app.logger.timing(`PluginManager.loadAll`);

		if(!(await util.promisify(fs.stat)(this.folder)).isDirectory()) {
			fs.mkdir(folder);
		}

		const paths = await util.promisify(fs.readdir)(this.folder);

		for(const path of paths) {
			if(!(await util.promisify(fs.stat)(`${this.folder}/${path}/`)).isDirectory()) {
				continue;
			}

			await this.load(path);
		}

		this.app.logger.debug(`loaded ${this.size} plugin(s) in ${this.app.logger.timing(`PluginManager.loadAll`)}`);
	}

	async load(path) {
		this.app.logger.timing(`PluginManager.load.${path}`);

		let config;
		
		try {
			config = native.require(`${this.folder}/${path}/librimod.json`);
		}
		catch(e) {
			return this.app.logger.error(`couldn't load the config file for the plugin in ${path} (${e.message}).`);
		}

		if(config.name === undefined || config.version === undefined || config.index === undefined || config.author === undefined) {
			return this.app.logger.error(`the config for the plugin in ${path} is missing required options`);
		}

		let indexFunction;
		
		try {
			indexFunction = native.require(`${this.folder}/${path}/${config.index}`);
		}
		catch(e) {
			return this.app.logger.error(`couldn't find the main file for the plugin ${config.name} (${e.message}).`);
		}

		const plugin = new Plugin(Object.assign(config, {indexFunction}));
		this.set(plugin.name, plugin);

		this.app.logger.debug(`loaded the plugin ${plugin.name} in ${this.app.logger.timing(`PluginManager.load.${path}`)}`);

		return plugin;
	}
}