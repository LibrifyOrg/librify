import m from "mithril";

export default class GameListComponent {
	oninit(vnode) {
		this.app = vnode.attrs.app;
	}

	view(vnode) {
		const games = this.app.gameManager.games.map(game => {
			return m(".game-item", {onclick: () => {
				vnode.attrs.parent.game = game;
				m.redraw();
			}}, game.name);
		});

		return m(".game-list", games);
	}
}