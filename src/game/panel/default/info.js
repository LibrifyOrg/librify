import m from "mithril";
import PanelModel from "@/game/panel/model";
import InfoPanelComponent from "@/ui/components/panel/info";

export default class InfoPanel extends PanelModel {
	constructor(app) {
		super();

		this.app = app;
		this.name = "info";
		this.icon = "../resources/images/icons/info.png";
	}

	component(game) {
		return (<InfoPanelComponent app={this.app} game={game}/>);
	}
}