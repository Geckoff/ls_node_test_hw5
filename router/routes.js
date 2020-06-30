const api = "/api";
const registration = api + "/registration";
const refreshToken = api + "/refresh-token";
const login = api + "/login";
const profile = api + "/profile";
const news = api + "/news";
const newsById = news + "/:id";
const users = api + "/users";
const userById = users + "/:id";
const userByIdPermission = userById + "/permission";
const undefinedRoute = "*";

module.exports = {
	api,
	registration,
	refreshToken,
	login,
	profile,
	news,
	newsById,
	users,
	userById,
	userByIdPermission,
	undefinedRoute,
};
