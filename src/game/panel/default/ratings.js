import m from "mithril";
import PanelModel from "@/game/panel/model";

export default class RatingsPanel extends PanelModel {
	constructor() {
		super();

		this.name = "ratings";
		this.icon = "../resources/images/icons/ratings.png"
	}

	component() {
		return (
			<div>Ratings</div>
		);
	}
}