import Game from "@/game/model";
import {EventEmitter} from "events";
import shortid from "shortid";
import m from "mithril";
import SourceManager from "@/game/source/manager";
import LauncherManager from "@/game/launcher/manager";

export default class GameManager extends EventEmitter {
	constructor(app) {
		super();

		this.app = app;
		this.sourceManager = new SourceManager(this);
		this.launcherManager = new LauncherManager(this);
	}

	async initialize() {
		this.config = await this.app.configManager.get("games.json");
		this.config.defaults({games: []}).write();
		this.games = this.config.get("games").value().map(gameData => {
			const game = new Game(this.app, gameData);
			this.emit("load", game);

			return game;
		});

		await this.find();
	}

	async find() {
		const launchers = Array.from(this.launcherManager.launchers.values());

		for(let launcher of launchers) {
			await launcher.findGames();
		}
	}

	create({name, origin}) {
		let sources = Array.from(this.sourceManager.sources.keys()).map(name => {return {name, populated: false}});

		this.games.push(new Game(this.app, {name, id: shortid(), origin, sources}));

		m.redraw();
	}

	remove(id) {
		this.games = this.games.filter(game => game.id !== id);

		m.redraw();
	}

	exists(id) {
		return this.games.find(game => game.id === id) !== undefined;
	}

	save() {
		this.config.set("games", this.games.map(game => game.toObject())).write();
	}
}