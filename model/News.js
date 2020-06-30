const NewsDB = require("../db/News");

class News {
	constructor(propsDbModel) {
		this.id = propsDbModel._id;
		this.created_at = propsDbModel.created_at;
		this.text = propsDbModel.text;
		this.title = propsDbModel.title;
		this.user = propsDbModel.user;
		this.dbModel = propsDbModel._id ? propsDbModel : null;
	}

	save = async () => {
		if (!this.dbModel) {
			this.dbModel = new NewsDB(this);
			await this.dbModel.save();
			await this.dbModel.populate("user").execPopulate();
			this.id = this.dbModel.id;
			this.user = this.constructor.getFrontUserObject(this.dbModel.user);
		} else {
			this.dbModel.created_at = this.created_at;
			this.dbModel.text = this.text;
			this.dbModel.title = this.title;
			this.dbModel.user = this.user;
			await this.dbModel.save();
		}
	};

	getFrontNewsObject = () => {
		const newsObject = {
			id: this.id,
			created_at: this.created_at,
			text: this.text,
			title: this.title,
		};
		if (this.user) {
			newsObject.user = this.constructor.getFrontUserObject(this.user);
		}
		return newsObject;
	};
}

News.findAllNewsWithAuthor = async () => {
	const allDbNews = await NewsDB.find().populate("user");
	return allDbNews.map((dbNews) => new News(dbNews));
};

News.findById = async (id) => {
	const dbNews = await NewsDB.findById(id).populate("user");
	return new News(dbNews);
};

News.deleteById = async (id) => {
	const wasDeleted = await NewsDB.findByIdAndRemove(id);
	return !!wasDeleted;
};

News.getFrontUserObject = (user) => {
	return {
		id: user.id,
		firstName: user.firstName,
		middleName: user.middleName,
		surName: user.surName,
		username: user.username,
		image: undefined,
	};
};

module.exports = News;
