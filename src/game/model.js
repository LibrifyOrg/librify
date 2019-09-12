export default class Game {
	constructor(app, config) {
		this.id = config.id;
		this.name = config.name;
		this.origin = config.origin;
		this.background = config.background;
		this.icon = config.icon;
		this.banner = config.banner;
		this.sources = config.sources.map(source => app.gameManager.sourceManager.create(source)).filter(source => source !== undefined);
	}

	toObject() {
		let obj = {
			id: this.id,
			name: this.name,
			origin: this.origin,
			background: this.background,
			icon: this.icon,
			banner: this.banner
		};

		obj.sources = this.sources.map(source => source.toObject());

		return obj;
	}
}