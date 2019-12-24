import winston from "winston";
import path from "path";
import prettyMilliseconds from "pretty-ms";

/**
 * The logger class is only used to return a window.Logger configurized to log less and more for 
 * production and development mode respectively.
 */
export default class Logger {
	/** @ignore */
	constructor(app) {
		/** @ignore */
		this.app = app;
		/** @ignore */
		this.tags = new Map();
	}

	/**
	 * Creates a winston.Logger class that can be used to log to your hearts content. It also adds 
	 * an extra method to the logger .timing(tag), with which you can time your code. Use the tag 
	 * parameter you can specify the tag to time. When using that tag again it will return the 
	 * timing, already prettified.
	 * @example 
	 * app.logger.info("test");
	 * //-> logs "test"
	 * @example
	 * app.logger.timing("test");
	 * // code
	 * app.logger.info(`took ${app.logger.timing("test")}`);
	 * //-> logs "took 0ms"
	 * @return {winston.Logger} The logger created by winston
	 */
	create() {
		const defaultFormat = winston.format.combine(
			winston.format.timestamp(),
			winston.format.json()
		);

		const logger = new winston.createLogger({
			transports: [
				new winston.transports.File({
					format: defaultFormat,
					level: this.app.electron.app.isPackaged ? "info" : "debug",
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

		logger.timing = tag => {
			let newTime = new Date().getTime();
			let oldTime = this.tags.get(tag) || new Date().getTime();

			this.tags.set(tag, newTime);

			return prettyMilliseconds(newTime - oldTime);
		}

		if(this.app.electron.app.isPackaged) {
			return logger;
		}

		logger.add(new winston.transports.Console({
			format: winston.format.simple(),
			level: "debug"
		}));

		return logger;
	}
}