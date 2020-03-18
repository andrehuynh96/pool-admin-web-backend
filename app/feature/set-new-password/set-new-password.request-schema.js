const Joi = require('joi');

const schema = Joi.object().keys({
  verify_token: Joi.string().required(),
  password: Joi.string().min(10).required(),
});

module.exports = schema;