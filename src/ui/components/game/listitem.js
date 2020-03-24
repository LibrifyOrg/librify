import m from "mithril";

const playSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M3 22v-20l18 10-18 10z"/></svg>`);

export default class GameListItemComponent {
	oninit(vnode) {
		this.app = vnode.attrs.app;
	}

	gameClickListener(game) {
		this.app.ui.game = game;
		
		if(document.getElementById(this.app.ui.game.id)) document.getElementById(this.app.ui.game.id).classList.remove("selected");
		document.getElementById(game.id).classList.add("selected");

		m.redraw();
	}

	view(vnode) {
		const game = vnode.attrs.game;
		const playable = game.actions.length > 0;
		const labels = game.labels.map(id => this.app.games.labels.get(id)).map(label => m(".label", {style: {background: label.color}}, label.name));

		return (
			<div class={`game-item${game.id === this.app.ui.game.id ? " selected" : ""}`} id={game.id} onclick={() => this.gameClickListener(game)}>
				<div class={`icon${playable ? " playable" : ""}`} style={game.data.icon ? `background-image: url(${game.data.icon})` : ``} onclick={() => playable ? this.app.games.launch(game) : {}}>
					<div class="play-icon">{playSvg}</div>
				</div>
				<div class="title">
					<div class="title-text">{game.data.name}</div>
					<div class="title-labels small">{labels}</div>
				</div>
			</div>
		);
	}
}