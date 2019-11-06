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

export default class PluginManager extends Map {
	constructor(app) {
		super();

		this.app = app;
		this.folder = path.resolve("plugins/");
	}

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

	async uninstall(name) {
		this.app.logger.timing(`PluginManager.uninstall.${name}`);

		let plugin = this.get(name);

		if(!plugin) return;

		let pluginFolder = `${this.folder}/${name}/`;

		await this.disable(name);
		await util.promisify(rimraf)(pluginFolder);

		this.app.logger.debug(`uninstalled plugin ${name} in ${this.app.logger.timing(`PluginManager.uninstall.${name}`)}`);
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

	enableAll() {
		return this.executeAll("enable");
	}

	enable(name) {
		return this.execute("enable", name);
	}

	disableAll() {
		return this.executeAll("disable");
	}

	disable(name) {
		return this.execute("disable", name);
	}

	async executeAll(event) {
		this.app.logger.timing(`PluginManager.all${event}`);

		for(let name of Array.from(this.keys())) {
			await this.execute(event, name);
		}

		this.app.logger.debug(`${event.endsWith("e") ? event + "d" : event + "ed"} ${this.size} plugin(s) in ${this.app.logger.timing(`PluginManager.${event}`)}`);
	}

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