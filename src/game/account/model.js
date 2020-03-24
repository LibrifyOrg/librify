export default class AccountModel {
	constructor(data, user) {
		this.id = data.id;
		this.user = user;
		this.loggedin = false;
		this.data = data;
	}

	login() {}
	fetchOwnedGames(skipGames) {}
}