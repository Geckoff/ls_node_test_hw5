const BaseController = require("./Base");
const User = require("../model/User");

class RefreshTokenController extends BaseController {
	postRefreshToken = async (req, res) => {
		const refreshToken = req.headers.authorization;
		const user = await this.getUserByToken(refreshToken);
		if (!user) {
			this.respondWithError({ message: this.loginErrorMessage }, res);
			return;
		}

		const {
			accessToken,
			accessTokenExpiredAt,
		} = await this.tokens.getAccessTokenAndExpiration({ user: user.id });

		this.respondWithData(
			{
				accessToken,
				accessTokenExpiredAt,
				refreshToken,
				refreshTokenExpiredAt: user.refreshTokenExpiredAt,
			},
			res
		);
	};

	getUserByToken = async (token) => {
		let userId = -1;
		try {
			const decodedToken = this.tokens.decodeToken(token);
			userId = decodedToken.user.id;
			const user = await User.findById(userId);
			return user.refreshTokenExpiredAt > Date.now() ? user : false;
		} catch (err) {
			return false;
		}
	};
}

module.exports = new RefreshTokenController();
