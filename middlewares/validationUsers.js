const Joi = require("joi");
const { USER_ROLES_ENUM } = require("../constants/enums");

const validateResultJoi = (schema, req, res, next) => {
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).json({ status: result.error.details[0].message });
  }
  return next();
};

const addNewUserValidateJoi = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().max(30).email().required(),
    password: Joi.string().min(3).max(70).required(),
    subscription: Joi.compile(Object.values(USER_ROLES_ENUM)),
  });

  validateResultJoi(schema, req, res, next);
};

const loginValidateJoi = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().max(30).email().required(),
    password: Joi.string().min(3).max(70).required(),
  });

  validateResultJoi(schema, req, res, next);
};



module.exports = {
  addNewUserValidateJoi,
  loginValidateJoi,
};
