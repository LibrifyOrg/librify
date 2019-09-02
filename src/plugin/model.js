export default class Plugin {
	constructor(data) {
		this.name = data.name;
		this.data = data;
	}

	execute(event, ...args) {
		const functionName = `on${event}`;

		if(typeof this.data[functionName] !== "function") return;
		
		return this.data[functionName](...args);
	}
}