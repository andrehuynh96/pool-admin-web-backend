const Joi = require('joi');

const schema = Joi.object().keys({
  email: Joi.string().required(),
  name: Joi.string().required()
});

module.exports = schema;