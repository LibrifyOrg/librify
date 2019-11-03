import m from "mithril";
const arrowSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z"/></svg>`);
import GamePanelComponent from "@/ui/components/gamepanel";

export default class GameComponent {
	oninit(vnode) {
		this.app = vnode.attrs.app;
		this.panelType;
		this.panelOpened = false;
	}

	view(vnode) {
		this.game = vnode.attrs.game;

		let panelTypes = Array.from(this.app.games.panels.values()).map(panel => {
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

		const secondaryAction = this.game.actions.find(action => !action.primary);

		return (
			<div class="game">
				<div class="background" style={{backgroundImage: `url(${this.game.data.background})`}}></div>
				<div class="info">
					<div class="container title">
						<div class="title">{this.game.data.name}</div>
					</div>
					<div class={`container right ${!this.game.data.banner ? "no-banner" : ""}`}>
						{this.game.data.banner ? <img class="banner" src={this.game.data.banner} /> : ""}
						{this.game.actions.length > 0 ? <div class="primary-action" onclick={() => this.app.games.launch(this.game)}>Play</div> : <div class="no-action">Not launchable</div>}
						{this.game.actions.length > 1 ? <div class="secondary-actions" onmouseleave={() => this.game.actions.length > 2 ? this.closeActionDropup() : {}}>
							<div class="dropup-name" onclick={() => this.app.games.launch(this.game, this.game.actions.indexOf(secondaryAction))}>{secondaryAction.name}</div>
							{this.game.actions.length > 2 ? <div id="dropup-button" class="dropup-button" onclick={() => this.toggleActionDropup()}>{arrowSvg}</div> : ""}
							<div id="dropup-menu" class="dropup-menu">{this.game.actions.map(action => <div class="dropup-item" onclick={() => this.app.games.launch(this.game, this.game.actions.indexOf(action))}>{action.name}</div>)}</div>
						</div> : ""}
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

	toggleActionDropup() {
		document.getElementById("dropup-button").classList.toggle("opened");
		document.getElementById("dropup-menu").classList.toggle("opened");
	}

	closeActionDropup() {
		document.getElementById("dropup-button").classList.remove("opened");
		document.getElementById("dropup-menu").classList.remove("opened");
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