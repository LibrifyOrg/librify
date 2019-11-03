import DataTypeModel from "@/game/data/model";

export default class SourceDataTypeModel extends DataTypeModel {
	constructor() {
		super();
	}

	default() {
		return {sources: []};
	}

	fromObject(object, game) {
		game.sources = object.map(source => app.games.sources.create(source)).filter(source => source !== undefined);
	}

	toObject(game) {
		return game.sources.map(source => source.toObject());
	}
}