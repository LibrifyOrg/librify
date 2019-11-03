import LauncherModel from "@/game/launcher/model";

export default class LauncherManager extends Map {
	constructor() {
		super();
	}

	register(name, launcher) {
		this.set(name, launcher);
	}

	unregister(name) {
		this.delete(name);
	}

	model() {
		return LauncherModel;
	}
}