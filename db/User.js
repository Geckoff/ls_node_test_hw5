const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: [true, "User name is required."],
		minlength: [3, "User name has to be at least 3 characters long."],
		maxlength: [20, "User name has to be at most 20 characters long."],
		unique: true,
	},
	firstName: {
		type: String,
		min: 1,
		max: [100, "First name has to be at most 100 characters long."],
	},
	surName: {
		type: String,
		min: 1,
		max: [100, "Last name has to be at most 100 characters long."],
	},
	middleName: {
		type: String,
		min: 1,
		max: [100, "Middle name has to be at most 100 characters long."],
	},
	salt: {
		type: String,
	},
	hash: {
		type: String,
	},
	refreshToken: {
		type: String,
	},
	refreshTokenExpiredAt: {
		type: Number,
	},
	permission: {
		chat: {
			C: {
				type: Boolean,
				default: true,
			},
			R: {
				type: Boolean,
				default: true,
			},
			U: {
				type: Boolean,
				default: true,
			},
			D: {
				type: Boolean,
				default: true,
			},
		},
		news: {
			C: {
				type: Boolean,
				default: true,
			},
			R: {
				type: Boolean,
				default: true,
			},
			U: {
				type: Boolean,
				default: true,
			},
			D: {
				type: Boolean,
				default: true,
			},
		},
		settings: {
			C: {
				type: Boolean,
				default: true,
			},
			R: {
				type: Boolean,
				default: true,
			},
			U: {
				type: Boolean,
				default: true,
			},
			D: {
				type: Boolean,
				default: true,
			},
		},
	},
});

const User = mongoose.model("user", userSchema);

module.exports = User;
