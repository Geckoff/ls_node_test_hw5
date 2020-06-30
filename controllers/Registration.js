const User = require("../model/User");
const BaseController = require("./Base");
const { validatePasswordSchema } = require("../utils/validation");

class RegistrationController extends BaseController {
	postRegister = async (req, res) => {
		const { username, password, firstName, surName, middleName } = req.body;

		if (!this.joiValidate(res, validatePasswordSchema, { password })) {
			return;
		}

		const user = new User({
			username,
			firstName,
			surName,
			middleName,
		});

		user.setPassword(password);

		try {
			await user.save();
			const userId = user.id;
			const {
				accessToken,
				refreshToken,
				accessTokenExpiredAt,
				refreshTokenExpiredAt,
			} = await this.tokens.getTokens({ id: userId });
			user.refreshToken = refreshToken;
			user.refreshTokenExpiredAt = refreshTokenExpiredAt;
			await user.save();
			const fonrtAuthorizedUserObj = user.getFrontAuthorizedUserObject({
				accessToken,
				accessTokenExpiredAt,
			});
			this.respondWithData(fonrtAuthorizedUserObj, res);
		} catch (err) {
			this.respondWithError(err, res);
		}
	};
}

module.exports = new RegistrationController();
