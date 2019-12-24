import fs from "fs";
import path from "path";
import util from "util";
import http from "http";
import tar from "tar";
import rimraf from "rimraf";
import semver from "semver";
import Plugin from "@/plugin/model";
import native from "@/native";

function request(url, options) {
	return new Promise((resolve, reject) => {
		let req = http.request(url, options, res => {
			resolve(res);
		});
		req.on("error", err => reject(err));
		req.end();
	});
}

function waitForData(stream) {
	return new Promise((resolve, reject) => {
		let buffer = Buffer.from("");

		stream.on("data", chunk => buffer = Buffer.concat([buffer, chunk]));
		stream.on("end", () => resolve(buffer.toString()));
	});
}

/**
 * This class manages the plugins and can also install, update and uninstall them. The class 
 * extends a Map, to make methods like .has() more accesible.
 */
export default class PluginManager extends Map {
	/** @ignore */
	constructor(app) {
		super();

		/** @ignore */
		this.app = app;

		/** The path to the plugins folder.
		 * @type {String} */
		this.folder = path.resolve("plugins/");
	}

	/**
	 * Installs the plugin with the specified name. It will create the folder the plugin is 
	 * installed in and if the folder already exists it will replace it. This is done since the 
	 * {@link PluginManager.update} method should be used when trying to update a plugin. It will 
	 * also load and enable the plugin after it is installed.
	 * @param {String} name The name of the plugin
	 * @return {Plugin} The installed and loaded plugin
	 */
	async install(name) {
		this.app.logger.timing(`PluginManager.install.${name}`);

		let pluginFolder = `${this.folder}/${name}/`;

		if(fs.existsSync(pluginFolder) && (await util.promisify(fs.stat)(pluginFolder)).isDirectory()) {
			await util.promisify(rimraf)(pluginFolder);
		}

		let res = await request(`http://localhost/registry/download/${name}`);

		if(res.statusCode !== 200) return this.app.logger.error(`An error occurred trying to download the plugin ${name}, code: ${res.statusCode}`);

		await util.promisify(fs.mkdir)(pluginFolder);

		let extractStream = tar.extract({cwd: pluginFolder});

		extractStream.on("finish", async () => {
			this.app.logger.debug(`installed plugin ${name} in ${this.app.logger.timing(`PluginManager.install.${name}`)}`);

			await this.load(name);
			await this.enable(name);
		});

		res.pipe(extractStream);
	}

	/**
	 * Updates the specified plugin. It does this by determining if it needs to be updated at all 
	 * and if so it will disable it and replace the old plugin with the new one using 
	 * {@link PluginManager.update}.
	 * @param {String} name The name of the plugin
	 */
	async update(name) {
		this.app.logger.timing(`PluginManager.update.${name}`);

		let plugin = this.get(name);

		if(!plugin) return;

		let res = await request(`http://localhost/registry/version/${name}`);

		if(res.statusCode !== 200) return this.app.logger.error(`An error occurred trying to checking the latest version for the plugin ${name}, code: ${res.statusCode}`);

		let version = await waitForData(res);

		if(semver.lte(version, plugin.version)) return;

		await this.disable(name);
		await this.install(name);

		this.app.logger.debug(`updated plugin ${name} in ${this.app.logger.timing(`PluginManager.update.${name}`)}`);
	}

	/**
	 * Uninstalls the specified plugin. This is done by disabling it and then removing the plugin 
	 * folder.
	 * @param {String} name The name of the plugin
	 */
	async uninstall(name) {
		this.app.logger.timing(`PluginManager.uninstall.${name}`);

		let plugin = this.get(name);

		if(!plugin) return;

		let pluginFolder = `${this.folder}/${name}/`;

		await this.disable(name);
		await util.promisify(rimraf)(pluginFolder);

		this.app.logger.debug(`uninstalled plugin ${name} in ${this.app.logger.timing(`PluginManager.uninstall.${name}`)}`);
	}

	/**
	 * Loads all the plugins. Used at startup to find all the plugins in 
	 * {@link PluginManager.folder} and load each of them.
	 */
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

	/**
	 * Loads the specified plugin. It does this by checking if there is an librimod.json or 
	 * package.json in the specified folder name, which it prefixes with 
	 * {@link PluginManager.folder}. If the plugin config is missing a name, version, index or 
	 * author it won't load. It will then load the index specified in the config and return the 
	 * loaded config.
	 * @param {String} path The path to the plugin 
	 * @return {Plugin} The loaded plugin
	 */
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

		let entry;
		
		try {
			entry = native.require(`${this.folder}/${path}/${config.index}`);
		}
		catch(e) {
			return this.app.logger.error(`couldn't find the main file for the plugin ${config.name} (${e.message}).`);
		}

		const plugin = new Plugin(config);

		try {
			plugin.reference = await entry();
		}
		catch(e) {
			return this.app.logger.error(`An error occurred when loading the entry function for the plugin ${plugin.name} (${e.message}).`);
		}
		
		this.set(plugin.name, plugin);

		this.app.logger.debug(`loaded the plugin ${plugin.name} in ${this.app.logger.timing(`PluginManager.load.${path}`)}`);

		return plugin;
	}

	/**
	 * Enables all the plugins. It is used at the application startup, but can also be used to 
	 * reload all the plugins after calling {@link PluginManager.disableAll}.
	 * @returns {Promise} Resolves when every plugin is enabled with the plugin
	 */
	enableAll() {
		return this.executeAll("enable");
	}

	/**
	 * Enables the specified plugin.
	 * @param {String} name The name of the plugin
	 * @returns {Promise<Plugin>} Resolves when the plugin is enabled
	 */
	enable(name) {
		return this.execute("enable", name);
	}

	/**
	 * Disables all the plugins. It is used at when the application is stopped, but can also be 
	 * used to reload all the plugins before calling {@link PluginManager.enableAll}.
	 * @returns {Promise} Resolves when every plugin is disabled
	 */
	disableAll() {
		return this.executeAll("disable");
	}

	/**
	 * Disables the specified plugin.
	 * @param {String} name The name of the plugin
	 * @returns {Promise<Plugin>} Resolves when the plugin is disabled with the plugin
	 */
	disable(name) {
		return this.execute("disable", name);
	}

	/**
	 * Executes the specified event for all the plugins. This method is used by 
	 * {@link PluginManager.enableAll} and {@link PluginManager.disableAll} to execute an event for
	 * all the plugins. It executes them all by calling {@link PluginManager.execute} for every 
	 * plugin, which in turn calls the with the event specified method for the plugin's index.
	 * @param {String} event The name of the event
	 */
	async executeAll(event) {
		this.app.logger.timing(`PluginManager.all${event}`);

		for(let name of Array.from(this.keys())) {
			await this.execute(event, name);
		}

		this.app.logger.debug(`${event.endsWith("e") ? event + "d" : event + "ed"} ${this.size} plugin(s) in ${this.app.logger.timing(`PluginManager.${event}`)}`);
	}

	/**
	 * Executes the specified event for the specified plugin. This method is used by 
	 * {@link PluginManager.enable} and {@link PluginManager.disable} to execute an event for 
	 * specific plugins. If the plugin has no index this method of course won't execute one of it's
	 * method.
	 * @param {String} event The name of the event
	 * @param {String} name The name of the plugin
	 * @return {Plugin} The plugin that has had a method executed
	 */
	async execute(event, name) {
		this.app.logger.timing(`PluginManager.${event}.${name}`);

		let plugin = this.get(name);

		if(typeof plugin !== "object") return;

		let eventFunction = plugin.reference[event];

		if(typeof eventFunction !== "function") return;

		await eventFunction.bind(plugin.reference)(this.app);

		this.app.logger.debug(`${event.endsWith("e") ? event + "d" : event + "ed"} plugin ${name} in ${this.app.logger.timing(`PluginManager.${event}.${name}`)}`);
	}
}