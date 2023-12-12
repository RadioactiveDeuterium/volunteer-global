const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(3).required(),
  name: Joi.string().min(3).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
});

const loginSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(3).required(),
});

const changePasswordSchema = Joi.object({
  password: Joi.string().min(3).required(),
});

const updateSchema = Joi.object({
  username: Joi.string().min(3).optional(),
  name: Joi.string().min(3).optional(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional(),
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  updateSchema,
};
