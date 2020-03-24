import shortid from "shortid";

export default class LabelManager extends Map {
	constructor(app) {
		super();

		this.app = app;
	}

	async initialize() {
		this.app.logger.timing("LabelManager.initialize");

		this.config = await this.app.helpers.config.get("labels.json");
		await this.config.defaults({labels: []}).write();
		this.config.get("labels").value().forEach(labelData => {
			this.set(labelData.id, labelData);
		});

		this.app.logger.debug(`loaded ${this.size} label(s) in ${this.app.logger.timing("LabelManager.initialize")}`);
	}

	create(name, color) {
		const id = shortid();

		this.set(id, {id, name, color});
	}

	async save() {
		this.app.logger.timing("LabelManager.save");

		await this.config.set("labels", Array.from(this.values())).write();

		this.app.logger.debug(`saved ${this.size} label(s) in ${this.app.logger.timing("LabelManager.launch")}`);
	}
}