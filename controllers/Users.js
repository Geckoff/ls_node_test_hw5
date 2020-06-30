const User = require("../model/User");
const BaseController = require("./Base");

class UsersController extends BaseController {
	deleteError = "User doesn't exist";
	updatePermissionError = "Permission update failed";

	getUsers = async (req, res) => {
		if (!this.isAuthorized(req, res)) {
			return;
		}

		try {
			const users = await User.findAll();
			const usersFrontObject = users.map((user) => user.getFrontUserObjectWithPermissions());
			this.respondWithData(usersFrontObject, res);
		} catch (err) {
			this.respondWithError(err, res);
		}
	};

	deleteUser = async (req, res) => {
		if (!this.isAuthorized(req, res)) {
			return;
		}

		try {
			const id = req.params.id;
			const deleteddUser = await User.deleteById(id);
			if (!deleteddUser) {
				this.respondWithError({ message: this.deleteError }, res);
			}
			this.respondWithData(true, res);
		} catch (err) {
			this.respondWithError(err, res);
		}
	};

	patchUserPermission = async (req, res) => {
		if (!this.isAuthorized(req, res)) {
			return;
		}

		try {
			const id = req.params.id;
			const { permission } = req.body;
			const updatedUser = await User.updateById(id, { permission });
			if (!updatedUser) {
				this.respondWithError({ message: this.updatePermissionError }, res);
			}
			const usersFrontObject = updatedUser.getFrontUserObjectWithPermissions();
			this.respondWithData(usersFrontObject, res);
		} catch (err) {
			this.respondWithError(err, res);
		}
	};
}

module.exports = new UsersController();
