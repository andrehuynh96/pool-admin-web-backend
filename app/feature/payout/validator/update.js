const Joi = require('joi');

const schema = Joi.object().keys({
    token_name: Joi.string().required(),
    token_symbol: Joi.string().required(),
    actived_flg: Joi.optional()
  })

module.exports = schema;