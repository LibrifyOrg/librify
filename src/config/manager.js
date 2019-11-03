import path from "path";
import low from "lowdb";
import FileAsync from "lowdb/adapters/FileSync";

export default class ConfigManager extends Map {
	constructor() {
		super();
	}

	async get(name) {
		if(this.has(name)) return super.get(name);

		const configPath = path.resolve("resources/config/" + name);
		const adapter = new FileAsync(configPath);
		const config = await low(adapter);

		this.set(name, config);

		return config;
	}
}