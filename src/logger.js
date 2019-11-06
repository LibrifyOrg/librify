import winston from "winston";
import path from "path";
import prettyMilliseconds from "pretty-ms";

export default class Logger {
	constructor(app) {
		this.app = app;
		this.tags = new Map();
	}

	isProduction() {
		return this.app.electron.app.isPackaged;
	}

	create() {
		const defaultFormat = winston.format.combine(
			winston.format.timestamp(),
			winston.format.json()
		);

		const logger = new winston.createLogger({
			transports: [
				new winston.transports.File({
					format: defaultFormat,
					level: this.isProduction() ? "info" : "debug",
					filename: path.join(process.cwd(), "logs/info.log"),
				}),
				new winston.transports.File({
					format: defaultFormat,
					level: "error",
					filename: path.join(process.cwd(), "logs/error.log"),
				})
			],
			exceptionHandlers: [
				new winston.transports.File({
					format: defaultFormat,
					filename: path.join(process.cwd(), "logs/exceptions.log"),
				})
			]
		});

		if(this.isProduction()) {
			return logger;
		}

		logger.timing = tag => {
			let newTime = new Date().getTime();
			let oldTime = this.tags.get(tag) || new Date().getTime();

			this.tags.set(tag, newTime);

			return prettyMilliseconds(newTime - oldTime);
		}

		logger.add(new winston.transports.Console({
			format: winston.format.simple(),
			level: "debug"
		}));

		return logger;
	}
}