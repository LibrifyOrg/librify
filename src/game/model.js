const protectedKeys = ["id, addedOn"];

export default class GameModel {
	constructor(app, data) {
		this.app = app;
		this.data = Object.assign(...Array.from(app.games.dataTypes.values()).map(dataType => dataType.default()), data);

		for(let [key, dataType] of Array.from(app.games.dataTypes.entries())) {
			dataType.fromObject(this.data[key], this);
		}
	}

	populate(object, override = true) {
		let keys = Object.keys(object);

		for(let key of keys) {
			if((this.data[key] !== undefined && !override) || protectedKeys.includes(key)) {
				continue;
			}

			this.data[key] = object[key];
		}
	}

	get id() {
		return this.data.id;
	}

	toObject() {
		let obj = this.data;

		for(let [key, dataType] of Array.from(this.app.games.dataTypes.entries())) {
			const value = dataType.toObject(this);

			if(value !== undefined) obj[key] = value;
		}

		return obj;
	}
}