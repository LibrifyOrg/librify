export default class PanelModel extends Map {
	constructor() {
		super();
	}

	component() {}

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