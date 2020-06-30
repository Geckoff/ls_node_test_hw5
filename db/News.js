const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = new Schema({
	created_at: {
		type: String,
		required: true,
	},
	text: {
		type: String,
	},
	title: {
		type: String,
		required: [true, "Enter post name."],
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "user",
	},
});

const News = mongoose.model("news", newsSchema);

module.exports = News;
