export default class Game {
	constructor(app, config) {
		this.id = config.id;
		this.name = config.name;
		this.origin = config.origin;
		this.sources = config.sources.map(source => app.gameManager.sourceManager.create(source));
	}

	toObject() {
		let obj = {
			id: this.id,
			name: this.name,
			origin: this.origin
		};

		obj.sources = this.sources.map(source => source.toObject());

		return obj;
	}
}