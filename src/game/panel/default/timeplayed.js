import m from "mithril";
import PanelModel from "@/game/panel/model";

export default class TimePlayedPanel extends PanelModel {
	constructor() {
		super();

		this.name = "timeplayed";
		this.icon = "../resources/images/icons/timeplayed.png"
	}

	component() {
		return (
			<div>Time Played</div>
		);
	}
}