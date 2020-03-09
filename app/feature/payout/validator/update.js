const Joi = require('joi');

const schema = Joi.array().items(
  Joi.object().keys({
    id: Joi.number().required(),
    token_name: Joi.string().required(),
    token_symbol: Joi.string().required(),
    actived_flg: Joi.optional()
  }))

module.exports = schema;