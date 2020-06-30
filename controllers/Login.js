const BaseController = require("./Base");
const User = require("../model/User");

class LoginController extends BaseController {
	loginErr = "Login or password is incorrect";

	postLogin = async (req, res) => {
		const { username, password } = req.body;

		try {
			const user = await User.findByProps({ username });

			if (!user || !password || !user.validatePassword(password)) {
				this.respondWithError({ message: this.loginErr }, res);
				return;
			}
			const {
				accessToken,
				refreshToken,
				accessTokenExpiredAt,
				refreshTokenExpiredAt,
			} = await this.tokens.getTokens({ id: user.id });
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

module.exports = new LoginController();
