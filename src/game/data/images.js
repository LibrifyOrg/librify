import axios from "axios";
import shortid from "shortid";
import fs from "fs";
import pathUtil from "path";
import util from "util";
import DataTypeModel from "@/game/data/model";

export default class ImagesDataTypeModel extends DataTypeModel {
	constructor(app) {
		super();

		this.app = app;
	}

	default() {
		return {images: []};
	}

	fromObject(object, game) {
		game.background = (index) => {
			const backgrounds = game.data.images.filter(image => image.type === "background");

			if(index === undefined) index = Math.floor(Math.random() * backgrounds.length);

			return backgrounds[index];
		}
		game.cover = () => {
			return game.data.images.find(image => image.type === "cover");
		}
		game.icon = () => {
			return game.data.images.find(image => image.type === "icon");
		}
		game.addImage = async (path, {type = "background", url = true, mime = "jpg"} = {}) => {
			if(type === "icon" || type === "cover") {
				game.data.images = game.data.images.filter(image => image.type !== type)
			}

			if(!url) return game.data.images.push({path, type, id: shortid()});

			const response = await axios({
				url: path,
				method: "GET",
				responseType: "stream"
			});

			const imageFolder = pathUtil.resolve(`resources/images/games/${game.id}`);
			const imageFile = pathUtil.resolve(imageFolder, `${id}.${mime}`);
			const id = shortid();

			if(!(await util.promisify(fs.stat)(imageFolder)).isDirectory()) {
				await util.promisify(fs.mkdir)(imageFolder);
			}

			const stream = fs.createWriteStream(imageFile);

			response.data.pipe(stream);

			return new Promise(success => {
				response.data.on("end", () => {
					game.data.images.push({path: imageFile, type, id});
					success();
				});
			});
		}
	}

	toObject(game) {
		return game.data.images;
	}
}