import m from "mithril";
import QuickLaunchView from "@/ui/views/quicklaunch";
import GamesView from "@/ui/views/games";

export default class UIHandler {
	constructor(app) {
		this.app = app;
		this.body = document.body;
	}

	startRendering() {
		m.route(this.body, "/games", {
			"/quick": {view: () => m(QuickLaunchView, {app: this.app})},
			"/games": {view: () => m(GamesView, {app: this.app})}
		});
	}
}

