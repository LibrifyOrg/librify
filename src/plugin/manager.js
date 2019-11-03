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
	}

	async load(path) {
		let config;
		
		try {
			config = native.require(`${this.folder}/${path}/librimod.json`);
		}
		catch(e) {
			return console.error(`Couldn't load the config file for the plugin in ${path} (${e.message}).`);
		}

		if(config.name === undefined || config.version === undefined || config.index === undefined || config.author === undefined) {
			return console.error(`The loaded config is missing required settings.`);
		}

		let indexFunction;
		
		try {
			indexFunction = native.require(`${this.folder}/${path}/${config.index}`);
		}
		catch(e) {
			console.error(e);
			return console.error(`Couldn't find the main file for the plugin in ${path} (${e.message}).`);
		}

		const plugin = new Plugin(Object.assign(config, {indexFunction}));
		this.set(plugin.name, plugin);

		await plugin.indexFunction(this.app);

		return plugin;
	}
}