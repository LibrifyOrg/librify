import DataTypeModel from "@/game/data/model";

export default class SourceDataTypeModel extends DataTypeModel {
	constructor(app) {
		super();

		this.app = app;
	}

	default() {
		return {sources: []};
	}

	fromObject(object, game) {
		game.sources = this.app.games.sources.create(game, object);
		game.fetch = async name => {
			if(name) {
				let source = game.sources.find(source.name === name);

				if(!source) return;
				
				await source.fetch();
			}
			else {
				for(let source of game.sources) {
					await source.fetch();
				}
			}
		};
	}

	toObject(game) {
		return game.sources.map(source => source.toObject());
	}
}