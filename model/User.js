const UserDB = require("../db/User");
const crypto = require("crypto");

class User {
	defaultPermission = {
		chat: { C: true, R: true, U: true, D: true },
		news: { C: true, R: true, U: true, D: true },
		settings: { C: true, R: true, U: true, D: true },
	};

	constructor(propsDbModel) {
		this.id = propsDbModel._id;
		this.username = propsDbModel.username;
		this.firstName = propsDbModel.firstName;
		this.surName = propsDbModel.surName;
		this.middleName = propsDbModel.middleName;
		this.salt = propsDbModel.salt;
		this.hash = propsDbModel.hash;
		this.refreshToken = propsDbModel.refreshToken;
		this.refreshTokenExpiredAt = propsDbModel.refreshTokenExpiredAt;
		this.permission = propsDbModel.permission || this.defaultPermission;
		this.dbModel = propsDbModel._id ? propsDbModel : null;
	}

	save = async () => {
		if (!this.dbModel) {
			this.dbModel = new UserDB(this);
			await this.dbModel.save();
			this.id = this.dbModel.id;
		} else {
			this.dbModel.username = this.username;
			this.dbModel.firstName = this.firstName;
			this.dbModel.surName = this.surName;
			this.dbModel.middleName = this.middleName;
			this.dbModel.salt = this.salt;
			this.dbModel.hash = this.hash;
			this.dbModel.refreshToken = this.refreshToken;
			this.dbModel.refreshTokenExpiredAt = this.refreshTokenExpiredAt;
			this.dbModel.permission = this.permission;
			await this.dbModel.save();
		}
	};

	setPassword = (password) => {
		this.salt = crypto.randomBytes(16).toString("hex");
		this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, "sha512").toString("hex");
	};

	validatePassword = (password) => {
		const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, "sha512").toString("hex");
		return hash === this.hash;
	};

	getFrontUserObject = () => {
		return {
			id: this.id,
			firstName: this.firstName,
			middleName: this.middleName,
			surName: this.surName,
			username: this.username,
			image: undefined,
		};
	};

	getFrontUserObjectWithPermissions = () => {
		const frontUserObject = this.getFrontUserObject();
		return {
			...frontUserObject,
			permission: this.permission,
		};
	};

	getFrontAuthorizedUserObject = ({ accessToken, accessTokenExpiredAt }) => {
		const frontUserObject = this.getFrontUserObjectWithPermissions();
		return {
			...frontUserObject,
			refreshToken: this.refreshToken,
			refreshTokenExpiredAt: this.refreshTokenExpiredAt,
			accessToken,
			accessTokenExpiredAt,
		};
	};
}

User.findById = async (id) => {
	const dbUser = await UserDB.findById(id);
	return dbUser ? new User(dbUser) : null;
};

User.findByProps = async (props) => {
	const dbUser = await UserDB.findOne(props);
	return dbUser ? new User(dbUser) : null;
};

User.findAll = async () => {
	const users = await UserDB.find();
	return users.map((user) => new User(user));
};

User.deleteById = async (id) => {
	const wasDeleted = await UserDB.findByIdAndRemove(id);
	return !!wasDeleted;
};

User.updateById = async (id, props) => {
	const dbUser = await UserDB.findByIdAndUpdate(id, props);
	return new User(dbUser);
};

User.updateByProps = async (propsToSearch, propsToUpdate) => {
	const dbUser = await UserDB.findOneAndUpdate(propsToSearch, propsToUpdate, { new: true });
	return new User(dbUser);
};

module.exports = User;
