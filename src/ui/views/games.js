import m from "mithril";
import GameComponent from "@/ui/components/game";
import GameListComponent from "@/ui/components/gamelist";

export default class GamesView {
	oninit(vnode) {
		this.app = vnode.attrs.app;
		this.game = this.app.gameManager.games[0];
	}

	onupdate() {
		if(this.app.games.has(this.game.id)) {
			return;
		} 
		
		this.game = this.app.gameManager.games[0];
		m.redraw();
	}

	view() {
		return (
			<div class="games">
				<GameListComponent app={this.app} parent={this}></GameListComponent>
				<GameComponent app={this.app} game={this.game}></GameComponent>
			</div>
		);
	}
}