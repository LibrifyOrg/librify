import SourceModel from "@/game/source/model";

export default class SourceManager {
	constructor() {
		this.sources = new Map();
	}

	register(name, sourceClass) {
		this.sources.set(name, sourceClass);
	}

	model() {
		return SourceModel;
	}

	create(config) {
		if(!config.name || !this.sources.get(config.name)) return;

		return new (this.sources.get(config.name))(config);
	}
}