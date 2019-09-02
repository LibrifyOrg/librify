import igdb from "igdb-api-node";
import secrets from "../../secrets.json";
import stringSimilarity from "string-similarity";

export default class IGDBHandler {
	constructor() {
		this.client = igdb(secrets.igdb_key);
	}

	getGame(where) {
		return this.client.where(where).fields("*").request("/games");
	}

	getGameByID(id) {
		return this.getGame(`id = ${id}`);
	}

	searchForGame(name, fields = ["id"]) {
		return this.client.search(name).fields(fields).request("/games");
	}

	async searchForBestGameMatch(name) {
		const matches = (await this.searchForGame(name, ["id", "name"])).data;

		const bestMatch = stringSimilarity.findBestMatch(name, matches.map(match => match.name)).bestMatch.target;

		return matches.find(match => match.name === bestMatch);
	}
}