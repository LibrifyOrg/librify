import SourceModel from "@/game/source/model";

export default class SourceManager extends Map {
	constructor() {
		super();
	}

	register(name, sourceClass) {
		this.set(name, sourceClass);
	}

	model() {
		return SourceModel;
	}

	create(config) {
		if(!config.name || !this.get(config.name)) return;

		return new (this.get(config.name))(config);
	}
}