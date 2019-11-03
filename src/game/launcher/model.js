export default class Launcher {
	constructor() {}

	/**
	 * Should fetch new games from the launcher this class interfaces with. It should only fetch new games, the current games are specified with the currentGames parameter, and it should return the games it found as an Array.
	 * @param {Array} currentGames The current games added to Librify
	 * @return The newly fetched games as an Array
	 */
	fetchNewGames(currentGames) {}
}