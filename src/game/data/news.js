import DataTypeModel from "@/game/data/model";

export default class NewsDataTypeModel extends DataTypeModel {
	constructor(app) {
		super();

		this.app = app;
	}

	default() {
		return {news: [], newsUpdated: 0};
	}

	fromObject(object, game) {
		game.addNews = (data) => {
			data.addedOn = new Date().getTime();

			game.data.news.push(data);
		}
		game.getNews = () => {
			const news = game.data.news = game.data.news.filter(news => (new Date().getTime() - news.addedOn) < 86400000);

			if(news.length > 0 || (new Date().getTime() - game.data.newsUpdated) < 86400000) return news;

			game.data.newsUpdated = new Date().getTime();

			return this.app.games.update([game], ["igdb-news"]);
		}
	}

	toObject(game) {
		return game.data.news;
	}
}