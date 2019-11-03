import LauncherModel from "@/game/launcher/model";

export default class LauncherManager extends Map {
	constructor() {
		super();
	}

	/**
	 * Registers a new launcher.
	 * @param {String} name The name of the launcher
	 * @param {Function} launcher The launcher itself
	 * @alias set
	 */
	register(name, launcher) {
		this.set(name, launcher);
	}

	/**
	 * Removes the launcher from the register.
	 * @param {String} type The name of the launcher to remove
	 * @alias delete
	 */
	unregister(name) {
		this.delete(name);
	}

	/**
	 * Returns the model for the launcher.
	 * @returns The LauncherModel class
	 */
	model() {
		return LauncherModel;
	}
}