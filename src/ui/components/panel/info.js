import m from "mithril";
import moment from "moment";

export default class InfoPanelComponent {
	oninit(vnode) {
		this.app = vnode.attrs.app;
		this.newsLength = 3;
		this.lastGame;
	}

	view(vnode) {
		const game = vnode.attrs.game;

		if(this.lastGame !== game) this.newsLength = 3;

		this.lastGame = game;

		let newsItems = game.getNews();
		let loadingNews = false;

		if(newsItems instanceof Promise) {
			newsItems.then(() => {console.log("test", newsItems);});
			newsItems = [];
			loadingNews = true;
		}

		if(this.newsLength > newsItems.length) this.newsLength = newsItems.length;
		if(this.newsLength === 0 && newsItems.length > 0) {
			this.newsLength = newsItems.length > 3 ? 3 : newsItems.length;
		}

		const newsItemsElements = newsItems.map(this.dataToNewsItem.bind(this)).slice(0, this.newsLength);

		return (
			<div class="wrapper">
				<div class="head">
					<div class="title">{game.data.name}</div>
					<div class="description">{game.data.description ? game.data.description : "The IGDB plugin is needed for this feature."}</div>
				</div>
				<div class="news">
					<div class="title"><span>News</span></div>
					<div class="items">
						{newsItemsElements.length > 0 ? newsItemsElements : loadingNews ? "Loading..." : "The IGDB plugin is needed for this feature."}
					</div>
					{newsItems.length > this.newsLength ? (<div class="more" onclick={() => this.loadMoreNews()}>Load More</div>) : ""}
				</div>
			</div>
		);
	}

	loadMoreNews() {
		this.newsLength += 3;
	}

	dataToNewsItem(item) {
		const summary = item.summary.substring(0, 100);

		return (
			<div class="item">
				<div class="item-title">{item.title}</div>
				<div class="subtitle">{item.source} - {item.author} at {moment(item.published_at * 1000).format("D MMM YYYY")}</div>
				<div class="summary">{summary.length === 100 ? summary + "..." : summary}</div>
			</div>
		);
	}
}