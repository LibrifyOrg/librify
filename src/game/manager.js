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
import ActionDataType from "@/game/action/data";
import NewsDataType from "@/game/data/news";
import ImagesDataType from "@/game/data/news";
import LabelManager from "@/game/label/manager";
import LabelDataTypeModel from "@/game/label/data";
import AccountManager from "@/game/account/manager";

export default class GameManager extends Map {
	constructor(app) {
		super();

		this.app = app;
		this.sources = new SourceManager();
		this.launchers = new LauncherManager(this.app);
		this.accounts = new AccountManager(this.app);
		this.labels = new LabelManager(this.app);
		this.panels = new PanelManager();
		this.actionTypes = new LaunchActionTypeManager();
		this.dataTypes = new DataTypeManager();
		this.dataTypes.register("actions", new ActionDataType());
		this.dataTypes.register("news", new NewsDataType(this.app));
		this.dataTypes.register("images", new ImagesDataType(this.app));
		this.dataTypes.register("labels", new LabelDataTypeModel(this.app));
		this.panels.register("settings", new SettingsPanel());
		this.panels.register("storage", new StoragePanel());
		this.panels.register("achievements", new AchievementsPanel());
		this.panels.register("timeplayed", new TimePlayedPanel());
		this.panels.register("ratings", new RatingsPanel());
		this.panels.register("info", new InfoPanel(this.app));
	}

	async initialize() {
		this.app.logger.timing("GameManager.initialize");

		this.config = await this.app.helpers.config.get("games.json");
		await this.config.defaults({games: []}).write();
		this.config.get("games").value().forEach(gameData => {
			const game = new Game(this.app, gameData);
			
			this.set(game.id, game);
		});
		await this.labels.initialize();
		await this.accounts.initialize();

		this.app.logger.debug(`loaded ${this.size} game(s) in ${this.app.logger.timing("GameManager.initialize")}`);
	}

	set(id, game) {
		super.set(id, game);

		m.redraw();
	}

	async findAllInstalled() {
		this.app.logger.timing("GameManager.findAll");
		let sizeBefore = this.size;

		const launchers = Array.from(this.launchers.keys());

		for(let name of launchers) {
			await this.findInstalled(name);
		}

		this.app.logger.debug(`found ${this.size-sizeBefore} new game(s) in ${this.app.logger.timing("GameManager.findAll")}`);
	}

	async findInstalled(launcherName) {
		this.app.logger.timing("GameManager.find");
		let sizeBefore = this.size;

		const launcher = this.launchers.get(launcherName);
		const games = await launcher.fetchInstalledGames(Array.from(this.values()));

		if(!Array.isArray(games)) return;

		for(let game of games) {
			if(Array.from(this.values()).find(oldGame => oldGame.data.name === game.data.name)) {
				continue;
			}

			game.data.origin = launcherName;

			this.set(game.id, game);
		}

		this.app.logger.debug(`${launcherName} found ${this.size-sizeBefore} new game(s) out of ${games.length} in ${this.app.logger.timing("GameManager.find")}`);
	}

	async launch(game, index) {
		this.app.logger.debug(`launching ${game} (${index})`).timing("GameManager.launch");

		let action;

		if(index === undefined) action = game.actions.find(action => action.primary);
		else action = game.actions[index];

		if(action === undefined) return;

		this.actionTypes.get(action.type)(game, action);

		this.app.logger.debug(`launched ${game} in ${this.app.logger.timing("GameManager.launch")}`);
	}

	async update(games, sourceNames) {
		if(games === undefined) games = Array.from(this.values());
		if(sourceNames === undefined) sourceNames = this.sources.order;

		const sources = sourceNames.map(sourceName => this.sources.get(sourceName));

		for(let source of sources) {
			const selectedGames = source.default ? games : games.filter(game => game.data.sources.find(context => context.name === source.name));

			if(selectedGames.length === 0) continue;

			const data = selectedGames.map(game => {
				let context = game.data.sources.find(context => context.name === source.name);

				if(context === undefined) {
					context = {name: source.name};

					game.data.sources.push(context);
				}

				return {game, context}
			});
			
			await source.reference.update(data);
		}
	}

	create({name}) {
		let id = shortid();
		let addedOn = new Date().getTime();

		return new Game(this.app, {name, id, addedOn, sources: []});
	}

	delete(id) {
		super.delete(id);

		m.redraw();
	}

	async save() {
		this.app.logger.timing("GameManager.save");

		await this.labels.save();
		await this.accounts.save();
		await this.config.set("games", Array.from(this.values()).map(game => game.toObject())).write();

		this.app.logger.debug(`saved ${this.size} game(s) in ${this.app.logger.timing("GameManager.launch")}`);
	}
}