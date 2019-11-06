import m from "mithril";

const maximizeSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M22 6v16h-20v-16h20zm2-6h-24v24h24v-24z"/></svg>`);
const unmaximizeSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M22 6v12h-16v-12h16zm2-6h-20v20h20v-20zm-22 22v-19h-2v21h21v-2h-19z"/></svg>`);
const closeSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>`);
const listOnlySvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M0 0v24h24v-24h-24zm22 22h-6v-14h-14v-6h20v20z"/></svg>`);
const arrowSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z"/></svg>`);

export default class WindowView {
	oninit(vnode) {
		this.app = vnode.attrs.app;
	}

	minimizeClickListener() {
		this.app.ui.window.minimize();
	}

	maximizeClickListener(event) {
		let isMaximized = this.app.ui.window.isMaximized();

		if(isMaximized) {
			this.app.ui.window.unmaximize();

			this.app.logger.debug(`unmaximized window using button`);
		}
		else {
			this.app.ui.window.maximize();

			this.app.logger.debug(`maximized window using button`);
		}

		m.render(event.currentTarget, isMaximized ? unmaximizeSvg : maximizeSvg);
	}

	closeClickListener() {
		this.app.ui.window.close();

		this.app.logger.debug(`closed window using button`);
	}


			m.render(event.currentTarget, isMaximized ? unmaximizeSvg : maximizeSvg);
		}}, maximizeSvg);
		let closeButton = m(".button", {onclick: () => this.app.ui.window.close()}, closeSvg);
	view(vnode) {
		let minimizeButton = m(".button", {onclick: this.minimizeClickListener.bind(this)}, "_");
		let maximizeButton = m(".button#maximize", {onclick: this.maximizeClickListener.bind(this)}, maximizeSvg);
		let closeButton = m(".button", {onclick: this.closeClickListener.bind(this)}, closeSvg);
		let listOnlyButtonButton = m(".button", {onclick: this.listOnlyClickListener.bind(this)}, listOnlySvg);

		return (
			<div class="window">
				<div id="frame" class="frame sidebarOpened">
					<div class="arrows">
						<div class="arrow left">{arrowSvg}</div>
						<div class="arrow right">{arrowSvg}</div>
					</div>
					<div class="title">Librify</div>
					<div id="custom-window-buttons" class="buttons">
						
					</div>
					<div class="window-buttons">
						<div class="drag"></div>
						{minimizeButton}
						{maximizeButton}
						{closeButton}
					</div>
				</div>
				<div id="body"></div>
			</div>
		);
	}
}