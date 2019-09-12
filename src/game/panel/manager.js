import PanelModel from "@/game/panel/model";

export default class PanelManager {
	constructor() {
		this.panels = new Map();
	}

	register(name, panel) {
		this.panels.set(name, panel);
	}

	unregister(name) {
		this.panels.delete(name);
	}

	get(name) {
		return this.panels.get(name);
	}

	model() {
		return PanelModel;
	}

	toArray() {
		return Array.from(this.panels.values());
	}
}