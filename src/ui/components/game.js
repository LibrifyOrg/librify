import m from "mithril";

export default class GameComponent {
	view(vnode) {
		this.game = vnode.attrs.game;

		return (
			<div class="game">{JSON.stringify(this.game)}</div>
		);
	}
}