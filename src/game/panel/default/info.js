import m from "mithril";
import PanelModel from "@/game/panel/model";

export default class InfoPanel extends PanelModel {
	constructor() {
		super();

		this.name = "info";
		this.icon = "../resources/images/icons/info.png"
	}

	component() {
		return (
			<div>Info</div>
		);
	}
}