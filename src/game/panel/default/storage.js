import m from "mithril";
import PanelModel from "@/game/panel/model";

export default class StoragePanel extends PanelModel {
	constructor() {
		super();

		this.name = "storage";
		this.icon = "../resources/images/icons/storage.png"
	}

	component() {
		return (
			<div>Storage</div>
		);
	}
}