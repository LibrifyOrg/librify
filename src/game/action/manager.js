export default class LaunchActionTypeManager extends Map {
	constructor() {
		super();
	}

	/**
	 * Registers a new launch action type, allowing it to be assigned to game actions.
	 * @param {String} type The name of the launch action type
	 * @param {Function} callback The function that will be called to launch the action
	 */
	register(type, callback) {
		this.set(type, callback);
	}

	/**
	 * Removes the launch action type from the register.
	 * @param {String} type The name of the launch action type to remove
	 */
	unregister(type) {
		this.delete(type);
	}
}