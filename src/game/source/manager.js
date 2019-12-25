import SourceModel from "@/game/source/model";

export default class SourceManager extends Map {
	constructor(app) {
		super();

		this.app = app; 
		this.order = [];
	}

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
	register(name, source) {
		if(source instanceof SourceModel) {
			source = {reference};
		}

		source.name = name;

		this.set(name, source);
		this.addToOrder(name);
	}

	/**
	 * Returns the model for the source class.
	 * @return The SourceModel class
	 */
	model() {
		return SourceModel;
	}

	/**
	 * @interal
	 */
	addToOrder(name) {
		for(let sourceName of this.order) {
			source = this.get(sourceName);

			if(!source.dependencies || !source.dependencies.includes(name)) continue;

			return this.order.splice(this.order.indexOf(sourceName), 0, name);
		}

		this.order.push(name);
	}

	removeFromOrder(name) {
		this.order.splice(this.order.indexOf(name), 1);
	}

	unregister(name) {
		if(!this.has(name)) return;

		this.delete(name);
		this.removeFromOrder(name);
	}
}