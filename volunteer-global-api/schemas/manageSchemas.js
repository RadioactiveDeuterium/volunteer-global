const Joi = require('joi');

const applySchema = Joi.object({
  screeningResponses: Joi.array().items(Joi.string()).optional(),
});

const addTimeslotSchema = Joi.object({
  timeslotID: Joi.string().required(),
});

const removeTimeslotSchema = Joi.object({
  timeslotID: Joi.string().required(),
});

module.exports = {
  applySchema,
  addTimeslotSchema,
  removeTimeslotSchema,
};
