const Joi = require('joi');

const createSchema = Joi.object({
  positionID: Joi.string().required(),
  dateTime: Joi.date().required(),
  length: Joi.number().required(),
});

const updateSchema = Joi.object({
  dateTime: Joi.date().required(),
  length: Joi.number().required(),
});

module.exports = {
  createSchema,
  updateSchema,
};
