export default class AccountModel {
	constructor(data) {
		this.id = data.id;
		this.loggedin = false;
		this.data = data;
	}

	set id(id) {
		this.data.id = id;
	}

	get id() {
		return this.data.id;
	}

	login() {}
	fetchGames(skipGames) {}
}