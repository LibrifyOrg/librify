import m from "mithril";

const maximizeSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M22 6v16h-20v-16h20zm2-6h-24v24h24v-24z"/></svg>`);
const unmaximizeSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M22 6v12h-16v-12h16zm2-6h-20v20h20v-20zm-22 22v-19h-2v21h21v-2h-19z"/></svg>`);
const closeSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>`);
const arrowSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z"/></svg>`);
const settingsSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>`);
const filterSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M1 0h22l-9 15.094v8.906l-4-3v-5.906z"/></svg>`);
const searchSvg = m.trust(`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M23.832 19.641l-6.821-6.821c2.834-5.878-1.45-12.82-8.065-12.82-4.932 0-8.946 4.014-8.946 8.947 0 6.508 6.739 10.798 12.601 8.166l6.879 6.879c1.957.164 4.52-2.326 4.352-4.351zm-14.886-4.721c-3.293 0-5.973-2.68-5.973-5.973s2.68-5.973 5.973-5.973c3.294 0 5.974 2.68 5.974 5.973s-2.68 5.973-5.974 5.973z"/></svg>`);

export default class WindowView {
	oninit(vnode) {
		this.app = vnode.attrs.app;
	}

	view(vnode) {
		let minimizeButton = m(".button", {onclick: () => this.app.ui.window.minimize()}, "_");
		let maximizeButton = m(".button", {onclick: event => {
			let isMaximized = this.app.ui.window.isMaximized();

			if(isMaximized) this.app.ui.window.unmaximize();
			else this.app.ui.window.maximize();

			m.render(event.currentTarget, isMaximized ? unmaximizeSvg : maximizeSvg);
		}}, maximizeSvg);
		let closeButton = m(".button", {onclick: () => this.app.ui.window.close()}, closeSvg);

		return (
			<div class="window">
				<div id="frame" class="frame sidebarOpened">
					<div class="arrows">
						<div class="arrow left">{arrowSvg}</div>
						<div class="arrow right">{arrowSvg}</div>
					</div>
					<div class="title">Librify</div>
					<div class="buttons">
						<div class="button">{settingsSvg}</div>
						<div class="button">{filterSvg}</div>
						<div class="button">{searchSvg}</div>
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

	test() {
		console.log("test");
	}
}