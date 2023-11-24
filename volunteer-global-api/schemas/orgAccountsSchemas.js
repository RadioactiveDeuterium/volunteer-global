const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(3).required(),
  companyName: Joi.string().min(3).required(),
  contactEmail: Joi.string().email({ tlds: { allow: false } }),
  contactPhone: Joi.string()
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
  username: Joi.string().min(3).required(),
  companyName: Joi.string().min(3).required(),
  contactEmail: Joi.string().email({ tlds: { allow: false } }),
  contactPhone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  updateSchema,
};
