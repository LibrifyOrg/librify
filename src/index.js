import {remote} from "electron";
import Application from "@/app";

delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

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