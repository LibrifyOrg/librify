import {remote} from "electron";
import Application from "@/app";

const app = new Application();
app.start();

window.addEventListener("beforeunload", event => {
	app.stop()
	.then(() => remote.getCurrentWindow().destroy());

	event.returnValue = true;
});

window.app = app;