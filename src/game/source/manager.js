import SourceModel from "@/game/source/model";

export default class SourceManager extends Map {
	constructor() {
		super();
	}

	register(name, sourceClass) {
		this.set(name, sourceClass);
	/**
	 * Registers a new source class, so it can be instantiated for every game. A few options can 
	 * be supplied in the source parameter. If options are supplied as an object the source key 
	 * has to reference the source class. The option source.dependencies can be used to set 
	 * dependencies for the source. If source dependencies are set, they will be loaded before this 
	 * source. Another option is source.startup, by default this is set to false, but if turned on 
	 * it can force the source to fetch when it is created.
	 * @param {String} name The name for the source
	 * @param {Object} source The source object, can also be the class itself if no options are set
	 */
	}

	/**
	 * Returns the model for the source class.
	 * @return The SourceModel class
	 */
	model() {
		return SourceModel;
	}

	create(config) {
		if(!config.name || !this.get(config.name)) return;
	/**
	 * @interal
	 */

		return new (this.get(config.name))(config);
	}
}