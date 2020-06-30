const jwt = require("jsonwebtoken");

class Tokens {
	secretWord = "option";

	createToken = async (user, expiresIn) =>
		await jwt.sign(
			{
				user,
			},
			this.secretWord,
			{
				expiresIn,
			}
		);

	createRefreshToken = async (user) => await this.createToken(user, "7d");

	createAccessToken = async (user) => await this.createToken(user, "10m");

	getAccessTokenAndExpiration = async (tokenUser) => {
		const accessToken = await this.createAccessToken(tokenUser);
		const decodedAccessToken = this.decodeToken(accessToken);

		return {
			accessToken,
			accessTokenExpiredAt: decodedAccessToken.exp * 1000,
		};
	};

	getRefreshTokenAndExpiration = async (tokenUser) => {
		const refreshToken = await this.createRefreshToken(tokenUser);
		const decodedRefreshToken = this.decodeToken(refreshToken);

		return {
			refreshToken,
			refreshTokenExpiredAt: decodedRefreshToken.exp * 1000,
		};
	};

	decodeToken = (token) => {
		return jwt.verify(token, this.secretWord);
	};

	getDecodedValidToken = (token) => {
		if (!token) {
			return false;
		}
		const decodedToken = this.decodeToken(token);
		if (decodedToken.exp * 1000 < Date.now()) {
			return false;
		}
		return decodedToken;
	};

	getTokens = async (tokenUser) => {
		const { accessToken, accessTokenExpiredAt } = await this.getAccessTokenAndExpiration(
			tokenUser
		);
		const { refreshToken, refreshTokenExpiredAt } = await this.getRefreshTokenAndExpiration(
			tokenUser
		);

		return {
			accessToken,
			refreshToken,
			accessTokenExpiredAt,
			refreshTokenExpiredAt,
		};
	};
}

module.exports = new Tokens();
