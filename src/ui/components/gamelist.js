import m from "mithril";

export default class GameListComponent {
	oninit(vnode) {
		this.app = vnode.attrs.app;
		this.selected;
	}

	view(vnode) {
		const games = this.app.gameManager.games.map((game, index) => {
			if(this.selected === undefined) this.selected = game.id;

			return m(`.game-item${game.id === this.selected ? ".selected" : ""}#${game.id}`, {onclick: () => {
				vnode.attrs.parent.game = game;

				document.getElementById(this.selected).classList.remove("selected");
				document.getElementById(game.id).classList.add("selected");

				this.selected = game.id;

				m.redraw();
			}}, [
				m(".icon", {style: game.icon ? {backgroundImage: `url(${game.icon})`} : {}}),
				m(".title", game.name)
			]);
		});

		games.push(m(".list-toggle#list-toggle", {onclick: () => {
			document.getElementById("game-list").classList.toggle("opened");
			document.getElementById("frame").classList.toggle("sidebarOpened");
		}}, m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z"/>`)));

		return m(".game-list.opened#game-list", games);
	}
}