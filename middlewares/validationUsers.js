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

const emailValidateJoi = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().max(30).email().required(),
  });

  validateResultJoi(schema, req, res, next);
};

const passwordValidateJoi = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().min(3).max(70).required(),
  });

  validateResultJoi(schema, req, res, next);
};

module.exports = {
  addNewUserValidateJoi,
  loginValidateJoi,
  emailValidateJoi,
  passwordValidateJoi,
};


/**
// Other experience validation with Joi:

exports.createUserValidator = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      birthyear: Joi.number().min(1940).required(),
      password: Joi.string().regex(PASSWD_REGEX).required(),
      role: Joi.string().valid(...Object.values(enums.USER_ROLES_ENUM)),
    })
    .validate(data);
**/