import Game from "@/game/model";
import m from "mithril";
import shortid from "shortid";
import SourceManager from "@/game/source/manager";
import LauncherManager from "@/game/launcher/manager";
import PanelManager from "@/game/panel/manager";
import LaunchActionTypeManager from "@/game/action/manager";
import DataTypeManager from "@/game/data/manager";
import SettingsPanel from "@/game/panel/default/settings";
import AchievementsPanel from "@/game/panel/default/achievements";
import RatingsPanel from "@/game/panel/default/ratings";
import TimePlayedPanel from "@/game/panel/default/timeplayed";
import StoragePanel from "@/game/panel/default/storage";
import InfoPanel from "@/game/panel/default/info";
import SourceDataType from "@/game/source/data";
import ActionDataType from "./action/data";

export default class GameManager extends Map {
	constructor(app) {
		super();

		this.app = app;
		this.sources = new SourceManager(this);
		this.launchers = new LauncherManager(this);
		this.panels = new PanelManager(this);
		this.actionTypes = new LaunchActionTypeManager(this);
		this.dataTypes = new DataTypeManager(this);
		this.dataTypes.register("sources", new SourceDataType(this));
		this.dataTypes.register("actions", new ActionDataType(this));
		this.panels.register("settings", new SettingsPanel(this.app));
		this.panels.register("storage", new StoragePanel(this.app));
		this.panels.register("achievements", new AchievementsPanel(this.app));
		this.panels.register("timeplayed", new TimePlayedPanel(this.app));
		this.panels.register("ratings", new RatingsPanel(this.app));
		this.panels.register("info", new InfoPanel(this.app));
	}

	async initialize() {
		this.config = await this.app.configs.get("games.json");
		this.config.defaults({games: []}).write();
		this.config.get("games").value().forEach(gameData => {
			const game = new Game(this.app, gameData);
			
			this.set(game.id, game);
		});
	}

	set(id, game) {
		super.set(id, game);

		m.redraw();
	}

	async findAll() {
		const launchers = Array.from(this.launchers.keys());

		for(let name of launchers) {
			await this.find(name)
		}
	}

	async find(launcherName) {
		const launcher = this.launchers.get(launcherName);
		const newGames = await launcher.fetchNewGames(Array.from(this.values()));

		for(let newGame of newGames) {
			if(Array.from(this.values()).find(game => game.data.name === newGame.data.name)) {
				continue;
			}

			newGame.data.origin = name;

			this.set(newGame.id, newGame);
		}
	}

	async launch(game, index) {
		let action;

		if(index === undefined) action = game.actions.find(action => action.primary);
		else action = game.actions[index];

		if(action === undefined) return;

		this.actionTypes.get(action.type)(game, action);
	}

	create({name}) {
		let sources = Array.from(this.sources.keys()).map(name => {return {name, populated: false}});
		let id = shortid();

		return new Game(this.app, {name, id, sources});
	}

	delete(id) {
		super.delete(id);

		m.redraw();
	}

	save() {
		this.config.set("games", Array.from(this.values()).map(game => game.toObject())).write();
	}
}