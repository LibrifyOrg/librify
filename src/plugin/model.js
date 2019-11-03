export default class Plugin {
	constructor(data) {
		this.name = data.name;
		this.deprecated = data.deprecated;
		this.author = data.author;
		this.indexFunction = data.indexFunction;
		this.data = data;

		if(this.deprecated) console.warn(`The plugin ${this.name} is deprecated and shouldn't be used.`);
	}
}