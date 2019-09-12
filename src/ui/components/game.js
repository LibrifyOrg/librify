import m from "mithril";
import path from "path";
import GamePanelComponent from "@/ui/components/gamepanel";

export default class GameComponent {
	oninit(vnode) {
		this.app = vnode.attrs.app;
		this.panelType;
		this.panelOpened = false;
	}

	view(vnode) {
		this.game = vnode.attrs.game;

		let panelTypes = this.app.gameManager.panelManager.toArray().map(panel => {
			return m(`.type#panel-type-${panel.name}`, {onclick: () => {
				let prevType = this.panelType;

				this.panelType = panel.name;
				
				if(prevType) document.getElementById(`panel-type-${prevType}`).classList.toggle("selected");
				
				if(prevType === this.panelType || prevType === undefined) this.toggle();
				else {
					document.getElementById(`panel-type-${this.panelType}`).classList.toggle("selected");
					m.redraw();
				}
			}}, [
				m("img", {src: panel.icon})
			]);
		});

		return (
			<div class="game">
				<div class="background" style={{backgroundImage: `url(${this.game.background})`}}></div>
				<div class="info">
					<div class="container title">
						<div class="title">{this.game.name}</div>
					</div>
					<div class="container right">
						<img class="banner" src={this.game.banner} />
						<div class="primary-action">Play now</div>
						<div class="secondary-actions">With steam overlay</div>
					</div>
				</div>
				<div class="panel-types" id="panel-types">
					{panelTypes}
				</div>
				{m(".darken#darken", {onclick: () => this.panelOpened ? this.close() : undefined})}
				<GamePanelComponent app={this.app} game={this.game} type={this.panelType}></GamePanelComponent>
			</div>
		);
	}

	toggle() {
		this.panelOpened ? this.close() : this.open();
	}

	open() {
		if(this.panelOpened) return;

		this.panelOpened = true;
		document.getElementById(`panel-type-${this.panelType}`).classList.toggle("selected");
		document.getElementById("panel").classList.add("opened");
		document.getElementById("panel-types").classList.add("opened");
		document.getElementById("darken").classList.add("opened");

		m.redraw();
	}

	close() {
		if(!this.panelOpened) return;

		this.panelOpened = false;
		document.getElementById("panel").classList.remove("opened");
		document.getElementById("panel-types").classList.remove("opened");
		document.getElementById("darken").classList.remove("opened");

		setTimeout(() => {
			this.panelType = undefined;
			m.redraw();
		}, 1000);
	}
}