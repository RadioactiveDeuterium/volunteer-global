const Joi = require('joi');

const createSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
  screeningQuestions: Joi.array().items(Joi.string()).optional(),
});

const updateSchema = Joi.object({
  title: Joi.string().min(3).optional(),
  description: Joi.string().min(3).optional(),
  screeningQuestions: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
  createSchema,
  updateSchema,
};
