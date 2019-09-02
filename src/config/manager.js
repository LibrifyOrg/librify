import path from "path";
import low from "lowdb";
import FileAsync from "lowdb/adapters/FileSync";

export default class ConfigManager {
	constructor() {
		this.configs = new Map();
	}

	async get(name) {
		if(this.configs.has(name)) return this.configs.get(name);

		const configPath = path.resolve("resources/config/" + name);
		const adapter = new FileAsync(configPath);
		const config = await low(adapter);

		this.configs.set(name, config);

		return config;
	}
}