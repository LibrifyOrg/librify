import m from "mithril";
import GameComponent from "@/ui/components/game";
import GameListComponent from "@/ui/components/gamelist";

const settingsSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>`);
const filterSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M1 0h22l-9 15.094v8.906l-4-3v-5.906z"/></svg>`);
const searchSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M23.832 19.641l-6.821-6.821c2.834-5.878-1.45-12.82-8.065-12.82-4.932 0-8.946 4.014-8.946 8.947 0 6.508 6.739 10.798 12.601 8.166l6.879 6.879c1.957.164 4.52-2.326 4.352-4.351zm-14.886-4.721c-3.293 0-5.973-2.68-5.973-5.973s2.68-5.973 5.973-5.973c3.294 0 5.974 2.68 5.974 5.973s-2.68 5.973-5.974 5.973z"/></svg>`);

export default class GamesView {
	oninit(vnode) {
		this.app = vnode.attrs.app;
		this.game = Array.from(this.app.games.values()).sort((a, b) => a.data.name.localeCompare(b.data.name))[0];
	}

	onupdate() {
		if(this.app.games.has(this.game.id)) {
			return;
		} 
		
		this.game = Array.from(this.app.games.values()).sort((a, b) => a.data.name.localeCompare(b.data.name))[0];
		m.redraw();
	}

	settingsClickListener() {
		// open settings
	}

	filterClickListener() {
		if(this.menuType === "filter") this.menuType = undefined;
		else this.menuType = "filter";

		m.redraw();
	}

	searchClickListener() {
		if(this.menuType === "search") this.menuType = undefined;
		else this.menuType = "search";
		
		m.redraw();
	}

	view() {
		this.app.logger.debug("(re)drawing games ui");

		m.render(document.getElementById("custom-window-buttons"), m(".container", [
			m(".button", {onclick: this.settingsClickListener.bind(this)}, settingsSvg),
			m(".button", {onclick: this.filterClickListener.bind(this)}, filterSvg),
			m(".button", {onclick: this.searchClickListener.bind(this)}, searchSvg)
		]));

		return (
			<div class="games">
				<GameListComponent app={this.app} parent={this} menuType={this.menuType}></GameListComponent>
				<GameComponent app={this.app} game={this.game}></GameComponent>
			</div>
		);
	}
}