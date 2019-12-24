/**
 * This is the model for the plugins. It is not meant te be extended as it is created by the plugin manager only, when loading a plugin.
 */
export default class PluginModel {
	/** @ignore */
	constructor(app, data) {
		/** The name of the plugin.
		 * @type {String}
		 * @readonly */
		this.name = data.name;
		/** If the plugin is deprecated. If so it will log a warning.
		 * @type {Boolean}
		 * @readonly */
		this.deprecated = data.deprecated;
		/** The name of the author of the plugin.
		 * @type {String}
		 * @readonly */
		this.author = data.author;
		/** The path for the index file of the plugin.
		 * @type {String}
		 * @readonly */
		this.indexPath = data.index;
		/** The version the plugin is currently on.
		 * @type {String}
		 * @readonly */
		this.version = data.version;
		/** The remaining data for the plugin. May be altered, but should be done precautiously.
		 * @type {Object} */
		this.data = data;

		if(this.deprecated) app.logger.warn(`The plugin ${this.name} is deprecated and shouldn't be used.`);
	}
}