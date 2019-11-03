import PanelModel from "@/game/panel/model";

export default class PanelManager extends Map {
	constructor() {
		super();
	}

	register(name, panel) {
		this.set(name, panel);
	}

	unregister(name) {
		this.delete(name);
	}

	model() {
		return PanelModel;
	}
}