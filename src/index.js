import {remote} from "electron";
import Application from "@/app";

const app = new Application();
app.start();

window.addEventListener("beforeunload", event => {
	app.stop()
	.then(() => {
		if(!remote.app.isPackaged) {
			return;
		}

		remote.getCurrentWindow().destroy();
	});
});

window.app = app;