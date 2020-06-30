const tokens = require("../utils/Tokens");

class BaseController {
	successStatus = "Success";
	failStatus = "Error";
	loginErrorMessage = "You have to be logged in";
	tokens = tokens;

	respondWithData = (result, res) => {
		// res.json({
		// 	status: this.successStatus,
		// 	data: result,
		// });
		res.json(result);
	};

	respondWithError = (err, res) => {
		console.log(err);
		const errMsg = this.composeErrorMessage(err);

		res.status(400).json({
			status: this.failStatus,
			message: errMsg,
		});
	};

	respondWithLoginError = (res, err) => {
		this.respondWithError({ message: this.loginErrorMessage, err }, res);
	};

	composeErrorMessage = (err) => {
		let errMsg = "";
		if (err && err.errors) {
			for (const errField in err.errors) {
				errMsg += `${err.errors[errField].properties.message} `;
			}
		} else if (err && err.message) {
			errMsg = err.message;
		} else {
			errMsg = "Request failed";
		}
		return errMsg;
	};

	joiValidate = (res, schema, obj) => {
		const valRes = schema.validate(obj);

		if (valRes.error) {
			this.respondWithError(valRes.error, res);
			return false;
		}

		return true;
	};

	getDecodedTokenWithResponse = (accessToken, res) => {
		try {
			const token = this.tokens.getDecodedValidToken(accessToken);
			if (!token) {
				this.respondWithLoginError(res, err);
				return false;
			}
			return token;
		} catch (err) {
			this.respondWithLoginError(res, err);
			return false;
		}
	};

	isAuthorized = (req, res) => {
		const accessToken = req.headers.authorization;
		const decodedToken = this.getDecodedTokenWithResponse(accessToken, res);
		return !!decodedToken;
	};
}

module.exports = BaseController;
