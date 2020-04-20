const Joi = require('joi');

const schema = Joi.object().keys({
  name: Joi.string().required(),
  level: Joi.number().min(1).required(),
  permission_ids: Joi.array().required()
});

module.exports = schema;