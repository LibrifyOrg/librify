module.exports = {
	name: "TestLauncher",
	onload: app => {
		class TestLauncher extends app.gameManager.launcherManager.model() {
			constructor() {
				super();
				
				this.games = (require("./games.json")).games;
			}
			
			findGames() {
				super.findGames();

				let existingGames = app.gameManager.games;

				for(let game of this.games) {
					if(existingGames.find(existingGame => existingGame.name === game.name)) {
						continue;
					}

					game.origin = "test";

					app.gameManager.create(game);
				}
			}

			launch() {
				
			}
		}

		app.gameManager.launcherManager.register("test", new TestLauncher());
	}
}