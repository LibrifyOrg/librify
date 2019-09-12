import m from "mithril";
import PanelModel from "@/game/panel/model";

export default class AchievementsPanel extends PanelModel {
	constructor() {
		super();

		this.name = "achievements";
		this.icon = "../resources/images/icons/achievements.png"
	}

	component() {
		return (
			<div>Achievements</div>
		);
	}
}