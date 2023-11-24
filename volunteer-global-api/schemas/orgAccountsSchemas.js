const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(3).required(),
  companyName: Joi.string().min(3).required(),
  contactEmail: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
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
  username: Joi.string().min(3).optional(),
  companyName: Joi.string().min(3).optional(),
  contactEmail: Joi.string()
    .email({ tlds: { allow: false } })
    .optional(),
  contactPhone: Joi.string()
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
