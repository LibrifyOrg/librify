import DataTypeModel from "@/game/data/model";
import LaunchAction from "@/game/action/model";

export default class ActionDataTypeModel extends DataTypeModel {
	constructor() {
		super();
	}

	default() {
		return {actions: []};
	}

	fromObject(object, game) {
		game.actions = object.map(action => new LaunchAction(action));
		game.addAction = options => {
			if(options.primary) {
				game.actions.forEach(action => action.primary = false);
			}

			game.actions.push(new LaunchAction(options));
		}
		game.removeAction = action => {
			game.actions = game.actions.filter(originalAction => originalAction !== action);

			if(!game.actions.find(action => action.primary) && game.actions.length > 0) {
				game.actions[0].primary = true;
			}
		}
		game.setPrimaryAction = action => {
			game.actions.forEach(action => action.primary = false);
			
			action.primary = true;
		}
	}

	toObject(game) {
		return game.actions.map(action => action.toObject());
	}
}