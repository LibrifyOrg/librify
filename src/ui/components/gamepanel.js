import m from "mithril";

export default class GamePanelComponent {
	oninit(vnode) {
		this.app = vnode.attrs.app;
	}

	view(vnode) {
		let panel = this.app.games.panels.get(vnode.attrs.type);

		if(panel === undefined) return (<div class="panel" id="panel"></div>);

		return (<div class="panel" id="panel">{panel.component(vnode.attrs.game)}</div>);
	}
}