import LauncherModel from "@/game/launcher/model";

export default class LauncherManager {
	constructor() {
		this.launchers = new Map();
	}

	register(name, launcher) {
		this.launchers.set(name, launcher);
	}

	unregister(name) {
		this.launchers.delete(name);
	}

	get(name) {
		return this.launchers.get(name);
	}

	model() {
		return LauncherModel;
	}
}