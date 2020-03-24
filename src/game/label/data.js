import m from "mithril";
import DataTypeModel from "@/game/data/model";

export default class LabelDataTypeModel extends DataTypeModel {
	constructor(app) {
		super();

		this.app = app;
	}

	default() {
		return {labels: []};
	}

	fromObject(object, game) {
		game.labels = object;
		game.addLabel = id => {
			if(game.labels.includes(id) || !this.app.games.labels.has(id)) return;

			game.labels.push(id);

			m.redraw();
		}
		game.removeLabel = id => {
			game.labels = game.labels.filter(label => label.id !== id);

			m.redraw();
		}
	}

	toObject(game) {
		return game.labels;
	}
}