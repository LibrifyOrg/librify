import DataTypeModel from "@/game/data/model";

export default class DataTypeManager extends Map {
	constructor() {
		super();
	}

	register(key, model) {
		this.set(key, model);
	}

	unregister(key) {
		this.delete(key);
	}

	model() {
		return DataTypeModel;
	}
}