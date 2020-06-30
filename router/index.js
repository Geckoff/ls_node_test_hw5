const express = require("express");
const router = express.Router();
const {
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
} = require("./routes");
const registrationController = require("../controllers/Registration");
const refreshTokenController = require("../controllers/RefreshToken");
const loginController = require("../controllers/Login");
const profileController = require("../controllers/Profile");
const newsController = require("../controllers/News");
const usersController = require("../controllers/Users");
const controller404 = require("../controllers/404");

router.post(registration, registrationController.postRegister);

router.post(refreshToken, refreshTokenController.postRefreshToken);

router.post(login, loginController.postLogin);

router.get(profile, profileController.getProfile);
router.patch(profile, profileController.patchProfile);

router.post(news, newsController.postNews);
router.get(news, newsController.getNews);
router.get(newsById, newsController.getNewsById);
router.patch(newsById, newsController.patchNewsById);
router.delete(newsById, newsController.deletehNewsById);

router.get(users, usersController.getUsers);
router.delete(userById, usersController.deleteUser);
router.patch(userByIdPermission, usersController.patchUserPermission);

router.get(undefinedRoute, controller404.propcess404);
router.post(undefinedRoute, controller404.propcess404);
router.put(undefinedRoute, controller404.propcess404);
router.patch(undefinedRoute, controller404.propcess404);
router.delete(undefinedRoute, controller404.propcess404);

module.exports = router;
