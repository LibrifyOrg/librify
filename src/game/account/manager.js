import shortid from "shortid";
import AccountModel from "@/game/account/model";

export default class AccountManager extends Map {
	constructor(app) {
		super();

		this.app = app;
		this.models = new Map();
	}

	async create(launcher, user) {
		const id = shortid();
		const account = new (this.models.get(launcher))({id, launcher}, user);

		this.set(id, account);
	}

	model() {
		return AccountModel;
	}

	register(launcher, model) {
		this.models.set(launcher, model);
	}

	unregister(launcher) {
		this.models.delete(launcher);
	}

	async initialize() {
		this.app.logger.timing("AccountManager.initialize");

		this.config = await this.app.helpers.config.get("accounts.json");
		await this.config.defaults({accounts: []}).write();
		this.config.get("accounts").value().forEach(accountData => {
			if(!this.has(accountData.launcher) || !accountData.name) return;

			this.set(accountData.id, new (this.models.get(accountData.launcher)));
		});

		this.app.logger.debug(`initialized ${this.size} accounts(s) in ${this.app.logger.timing("AccountManager.initialize")}`);
	}

	async save() {
		this.app.logger.timing("AccountManager.save");

		await this.config.set("accounts", Array.from(this.values()).map(account => account.data));

		this.app.logger.debug(`saved ${this.size} accounts(s) in ${this.app.logger.timing("AccountManager.save")}`);
	}
}