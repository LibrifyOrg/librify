export default class Game {
	constructor(app, data) {
		this.data = Object.assign(...Array.from(app.games.dataTypes.values()).map(dataType => dataType.default()), data);

		for(let [key, dataType] of Array.from(app.games.dataTypes.entries())) {
			dataType.fromObject(this.data[key], this);
		}
	}

	get id() {
		return this.data.id;
	}

	set id(value) {
		this.data.id = value;
	}

	toObject() {
		let obj = this.data;

		for(let [key, dataType] of Array.from(app.games.dataTypes.entries())) {
			const value = dataType.toObject(this);

			if(value !== undefined) obj[key] = value;
		}

		return obj;
	}
}