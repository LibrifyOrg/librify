import path from "path";
import low from "lowdb";
import FileAsync from "lowdb/adapters/FileSync";

export default class ConfigManager extends Map {
	constructor() {
		super();

		this.configPath = "resources/config/";
	}

	async get(name) {
		if(this.has(name)) return super.get(name);

		const configPath = path.resolve(this.configPath + name);
		const adapter = new FileAsync(configPath);
		const config = await low(adapter);

		this.set(name, config);

		return config;
	}
	forceGet(name) {
		if(this.has(name)) this.delete(name);

		return this.get(name)
	}
}