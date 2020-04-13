const Joi = require('joi');

const schema = Joi.object().keys({
  status: Joi.number().required()
});

module.exports = schema;