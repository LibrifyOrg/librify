import m from "mithril";
import GameListMenuComponent from "@/ui/components/gamelistmenu";

const arrowSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z"/></svg>`);
const playSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M3 22v-20l18 10-18 10z"/></svg>`);

export default class GameListComponent {
	oninit(vnode) {
		this.app = vnode.attrs.app;
		this.selected;
	}

	gameClickListener(game, vnode) {
		vnode.attrs.parent.game = game;
		
		if(document.getElementById(this.selected)) document.getElementById(this.selected).classList.remove("selected");
		document.getElementById(game.id).classList.add("selected");

		this.selected = game.id;

		m.redraw();
	}

	gameToItem(game, vnode) {
		if(this.selected === undefined) this.selected = game.id;

		const playable = game.actions.length > 0;

		return m(`.game-item${game.id === this.selected ? ".selected" : ""}#${game.id}`, {onclick: () => this.gameClickListener(game, vnode)}, [
			m(`.icon ${playable ? "playable" : ""}`, {style: game.data.icon ? {backgroundImage: `url(${game.data.icon})`} : {}, onclick: () => playable ? this.app.games.launch(game) : {}}, m(".play-icon", playSvg)),
			m(".title", game.data.name)
		]);
	}

	listToggleClickListener() {
		document.getElementById("game-list").classList.toggle("opened");
		document.getElementById("frame").classList.toggle("sidebarOpened");
	}

	view(vnode) {
		const games = this.games || Array.from(this.app.games.values()).sort((a, b) => a.data.name.localeCompare(b.data.name));
		const gameElements = games.map(name => this.gameToItem(name, vnode));

		return m(".game-list.opened#game-list", [
			(<GameListMenuComponent app={this.app} menuType={vnode.attrs.menuType} parent={this}></GameListMenuComponent>),
			m(".container", gameElements), 
			m(".list-toggle", {onclick: this.listToggleClickListener.bind(this)}, arrowSvg)
		]);
	}
}