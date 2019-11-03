import m from "mithril";

const arrowSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z"/></svg>`);
const playSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M3 22v-20l18 10-18 10z"/></svg>`);

export default class GameListComponent {
	oninit(vnode) {
		this.app = vnode.attrs.app;
		this.selected;
	}

	view(vnode) {
		const games = Array.from(this.app.games.values()).sort((a, b) => a.data.name.localeCompare(b.data.name)).map((game, index) => {
			if(this.selected === undefined) this.selected = game.id;

			const playable = game.actions.length > 0;

			return m(`.game-item${game.id === this.selected ? ".selected" : ""}#${game.id}`, {onclick: () => {
				vnode.attrs.parent.game = game;

				document.getElementById(this.selected).classList.remove("selected");
				document.getElementById(game.id).classList.add("selected");

				this.selected = game.id;

				m.redraw();
			}}, [
				m(`.icon ${playable ? "playable" : ""}`, {style: game.data.icon ? {backgroundImage: `url(${game.data.icon})`} : {}, onclick: () => playable ? this.app.games.launch(game) : {}}, m(".play-icon", playSvg)),
				m(".title", game.data.name)
			]);
		});

		games.push(m(".list-toggle", {onclick: () => {
			document.getElementById("game-list").classList.toggle("opened");
			document.getElementById("frame").classList.toggle("sidebarOpened");
		}}, arrowSvg));

		return m(".game-list.opened#game-list", games);
	}
}