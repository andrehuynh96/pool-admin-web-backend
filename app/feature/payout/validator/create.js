const Joi = require('joi');
const platforms = require('app/model/staking/value-object/platform').map(ele => ele.symbol);
const schema = Joi.object().keys({
    platform: Joi.string().required().valid(platforms),
    token_name: Joi.string().required(),
    token_symbol: Joi.string().required(),
    token_address: Joi.string().required(),
    actived_flg: Joi.optional()
  })
module.exports = schema;