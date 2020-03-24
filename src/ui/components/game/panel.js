import m from "mithril";

export default class GamePanelComponent {
	oninit(vnode) {
		this.app = vnode.attrs.app;
		this.selectedSub;
	}

	view(vnode) {
		let panel = this.app.games.panels.get(vnode.attrs.type);

		if(panel === undefined) return (<div class="panel" id="panel"></div>);

		const subs = Array.from(panel.values());

		if(subs.length > 0 && this.selectedSub === undefined) {
			this.selectedSub = subs[0];
		}

		const subButtons = subs.map(this.subToButton.bind(this));

		return (
			<div class="panel" id="panel">
				<div class="container" id={"panel-" + panel.name}>
					<div class="options">
						{subButtons}
					</div>
					{subs.length > 0 ? this.selectedSub.component(vnode.attrs.game) : panel.component(vnode.attrs.game)}
				</div>
			</div>
		);
	}

	subToButton(sub) {
		return m(`.option${sub.name === this.selectedSub.name ? ".selected" : ""}#sub-button-${sub.name}`, {onclick: () => this.subClickListener(sub)}, [
			m("img", {src: sub.icon})
		]);
	}

	subClickListener(sub) {
		let prevSub = this.selectedSub;

		this.selectedSub = sub;
		
		if(prevSub.name !== this.selectedSub.name) {
			document.getElementById(`sub-button-${this.selectedSub.name}`).classList.add("selected");
			document.getElementById(`sub-button-${prevSub.name}`).classList.remove("selected");
		}
	}
}