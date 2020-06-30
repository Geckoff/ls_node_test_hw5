const BaseController = require("./Base");

class Controller404 extends BaseController {
	notFoundError = "Endpoint does not exist";

	propcess404 = (_, res) => {
		this.respondWithError({ message: this.notFoundError }, res);
	};
}

module.exports = new Controller404();
