const Joi = require('joi');

const schema = Joi.object().keys({
  max_payout: Joi.number().required()
});

module.exports = schema;