import m from "mithril";
import PanelModel from "@/game/panel/model";

export default class SettingsPanel extends PanelModel {
	constructor() {
		super();

		this.name = "settings";
		this.icon = "../resources/images/icons/settings.png"
	}

	component() {
		return (
			<div>Settings</div>
		);
	}
}