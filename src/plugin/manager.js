import fs from "fs";
import path from "path";
import util from "util";
import Plugin from "@/plugin/model";
import native from "@/native";

export default class PluginManager {
	constructor(app) {
		this.app = app;
		this.plugins = new Map();
		this.pluginFolder = path.resolve("plugins/");
	}

	async loadAll() {
		if(!(await util.promisify(fs.stat)(this.pluginFolder)).isDirectory()) {
			fs.mkdir(pluginFolder);
		}

		const paths = await util.promisify(fs.readdir)(this.pluginFolder);

		for(const path of paths) {
			if(!(await util.promisify(fs.stat)(`${this.pluginFolder}/${path}/`)).isDirectory()) {
				return;
			}

			this.load(path);
		}
	}

	async load(path) {
		let mainFile;
		
		try {
			mainFile = native.require(`${this.pluginFolder}/${path}/plugin`);
		}
		catch(e) {
			console.log(e);
			console.error(`Couldn't find the main file for the plugin in ${path}`);
			return;
		}

		const plugin = new Plugin(mainFile);
		this.plugins.set(plugin.name, plugin);

		await plugin.execute("load", this.app);

		return plugin;
	}

	async unloadAll() {
		for(let plugin of this.plugins.entries) {
			await this.unload(plugin);
		}
	}

	async unload(pluginData) {
		let plugin = typeof pluginData === "string" ? this.plugins.get(name) : pluginData;

		await plugin.execute("unload");

		this.plugins.delete(plugin.name);
	}
}