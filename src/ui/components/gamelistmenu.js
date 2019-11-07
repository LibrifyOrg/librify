import m from "mithril";

export default class GameListMenuComponent {
	oninit(vnode) {
		this.app = vnode.attrs.app;
		this.parent = vnode.attrs.parent;
		this.values = new Map();
		this.filters = new Map();

		this.filters.set("search", game => game.data.name.toLowerCase().includes(this.values.get("search") || ""));
		this.filters.set("steam", game => this.values.get("steam") ? game.data.origin === "steam" : true);
	}

	viewSearch() {
		return (
			<div>
				<input class="searchbar" id="menu-searchbar" type="text" value={this.values.get("search") || ""} onkeyup={() => {
					this.values.set("search", document.getElementById("menu-searchbar").value.toLowerCase());
					this.updateParent();
				}}></input>
			</div>
		)
	}

	viewFilter() {
		return (
			<div>
				<input class="checkbox" id="menu-steam" type="checkbox" value={this.values.get("steam") || ""} onchange={() => {
					this.values.set("steam", document.getElementById("menu-steam").checked);
					this.updateParent();
				}}></input>
			</div>
		)
	}

	onupdate(vnode) {
		if(vnode.dom.children[0] && !this.close) {
			vnode.dom.style.height = vnode.dom.children[0].scrollHeight + "px";
		}
		else {
			this.close = false;
			vnode.dom.style.height = "0";
		}
	}

	updateParent() {
		let games = Array.from(this.app.games.values()).sort((a, b) => a.data.name.localeCompare(b.data.name));

		for(let filter of Array.from(this.filters.values())) {
			games = games.filter(filter);
		}

		this.parent.games = games;
	}

	view(vnode) {
		let menu;

		this.updateParent();

		switch(vnode.attrs.menuType) {
			case "search":
				menu = this.viewSearch(vnode);
				break;

			case "filter":
				menu = this.viewFilter(vnode);
				break;
		}

		if(this.menuType !== vnode.attrs.menuType) {
			this.menuType = vnode.attrs.menuType;
			
			if(this.menuType === undefined) {
				this.close = true;
				setTimeout(() => {this.menu = menu; m.redraw()}, 500);
			}
			else this.menu = menu;
		}

		return (
			<div class="menu">{this.menu}</div>
		);
	}
}