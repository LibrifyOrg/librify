export default class LaunchActionModel {
	constructor({primary = false, type, name, data = {}}) {
		this.primary = primary;
		this.type = type;
		this.name = name;
		this.data = data;
	}

	toObject() {
		let {primary, type, name, data} = this;

		return {primary, type, name, data};
	}
}