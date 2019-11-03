import path from "path";
import low from "lowdb";
import FileAsync from "lowdb/adapters/FileSync";

export default class ConfigManager extends Map {
	constructor() {
		super();

		this.configPath = "resources/config/";
	}

	/**
	 * Return the config from the config folder with the specified filename. Will return cached config if it has already been loaded.
	 * @param {String} name The name of the config file
	 * @returns A promise resolving to the config as Lodash object
	 */
	async get(name) {
		if(this.has(name)) return super.get(name);

		const configPath = path.resolve(this.configPath + name);
		const adapter = new FileAsync(configPath);
		const config = await low(adapter);

		this.set(name, config);

		return config;
	}

	/**
	 * Works the same as .get(), but forces it to load the config instead of returning the cached version, if applicable.
	 * @param {String} name The name of the config file
	 * @returns A promise resolving to the config as Lodash object
	 */
	forceGet(name) {
		if(this.has(name)) this.delete(name);

		return this.get(name)
	}
}