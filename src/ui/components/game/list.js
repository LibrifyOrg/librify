import m from "mithril";
import GameListMenuComponent from "@/ui/components/game/listmenu";
import GameListItemComponent from "@/ui/components/game/listitem";

const arrowSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z"/></svg>`);

export default class GameListComponent {
	oninit(vnode) {
		this.app = vnode.attrs.app;
	}

	listToggleClickListener() {
		document.getElementById("game-list").classList.toggle("opened");
		document.getElementById("frame").classList.toggle("sidebarOpened");
	}

	view(vnode) {
		const games = this.games || Array.from(this.app.games.values()).sort((a, b) => a.data.name.localeCompare(b.data.name));
		const gameElements = games.map(game => (<GameListItemComponent app={this.app} game={game}></GameListItemComponent>));

		return m(".game-list.opened#game-list", [
			(<GameListMenuComponent app={this.app} menuType={vnode.attrs.menuType} parent={this}></GameListMenuComponent>),
			m(".container", gameElements), 
			m(".list-toggle", {onclick: this.listToggleClickListener.bind(this)}, arrowSvg)
		]);
	}
}