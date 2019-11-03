import m from "mithril";
import QuickLaunchView from "@/ui/views/quicklaunch";
import GamesView from "@/ui/views/games";
import WindowView from "@/ui/views/window"

export default class UIHandler {
	constructor(app) {
		this.app = app;
		this.window = app.electron.getCurrentWindow();
	}

	startRendering() {
		m.render(document.body, m(WindowView, {app: this.app}));
		m.route(document.getElementById("body"), "/games", {
			"/quick": {view: () => m(QuickLaunchView, {app: this.app})},
			"/games": {view: () => m(GamesView, {app: this.app})}
		});
	}
}

