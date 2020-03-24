export default class RatingPanelComponent {
	oninit(vnode) {
		this.app = vnode.attrs.app;
	}

	view(vnode) {
		const game = vnode.attrs.game;

		return (
			<div class="wrapper">
				<div class="head">
					<div class="title">{game.data.rating}</div>
				</div>
			</div>
		);
	}
}