const Joi = require("joi");

const regPhone = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;

const validateResult = (schema, req, res, next) => {
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ status: result.error.details });
  }
  return next();
};

module.exports = {
  addPostValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string()
        .required()
        .pattern(/^[a-zA-Z0-9а-яА-Я ]{3,30}$/),
      email: Joi.string().min(4).max(30).email().required(),
      phone: Joi.string().min(7).max(30).required().pattern(regPhone),
      favorite: Joi.boolean(),
    });

    validateResult(schema, req, res, next);
  },

  addPutValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().pattern(/^[a-zA-Z0-9а-яА-Я ]{3,30}$/),
      email: Joi.string().min(4).max(30).email(),
      phone: Joi.string().min(7).max(30).pattern(regPhone),
    });

    validateResult(schema, req, res, next);
  },
};
