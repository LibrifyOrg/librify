import Game from "@/game/model";
import {EventEmitter} from "events";
import shortid from "shortid";
import m from "mithril";
import SourceManager from "@/game/source/manager";
import LauncherManager from "@/game/launcher/manager";
import PanelManager from "@/game/panel/manager";
import SettingsPanel from "@/game/panel/default/settings";
import AchievementsPanel from "@/game/panel/default/achievements";
import RatingsPanel from "@/game/panel/default/ratings";
import TimePlayedPanel from "@/game/panel/default/timeplayed";
import StoragePanel from "@/game/panel/default/storage";
import InfoPanel from "@/game/panel/default/info";

export default class GameManager extends EventEmitter {
	constructor(app) {
		super();

		this.app = app;
		this.sourceManager = new SourceManager(this);
		this.launcherManager = new LauncherManager(this);
		this.panelManager = new PanelManager(this);
		this.panelManager.register("settings", new SettingsPanel(this.app));
		this.panelManager.register("storage", new StoragePanel(this.app));
		this.panelManager.register("achievements", new AchievementsPanel(this.app));
		this.panelManager.register("timeplayed", new TimePlayedPanel(this.app));
		this.panelManager.register("ratings", new RatingsPanel(this.app));
		this.panelManager.register("info", new InfoPanel(this.app));
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