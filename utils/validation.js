const Joi = require("@hapi/joi");

validatePasswordSchema = Joi.object()
	.options({ abortEarly: false })
	.keys({
		password: Joi.string().alphanum().min(3).max(30).required(),
	});

module.exports = {
	validatePasswordSchema,
};
