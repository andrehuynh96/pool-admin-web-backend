const Joi = require('joi');

const schema = Joi.array().items(
  Joi.object().keys({
    id: Joi.number(),
    max_payout: Joi.number()
  }))

module.exports = schema;