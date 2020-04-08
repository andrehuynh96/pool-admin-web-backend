const Joi = require('joi');

const schema = Joi.array().items(
  Joi.object().keys({
    id: Joi.number(),
    commission: Joi.number()
  }))

module.exports = schema;