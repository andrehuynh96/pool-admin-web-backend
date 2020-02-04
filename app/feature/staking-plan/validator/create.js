const Joi = require('joi');

const schema = Joi.object().keys({
  staking_plan_code: Joi.string().required(),
  duration: Joi.number().required(),
  duration_type: Joi.string().required(),
  reward_per_year: Joi.number().required(),
  actived_flg: Joi.boolean().required(),
  reward_in_diff_platform_flg: Joi.boolean().required(),
  reward_platform: Joi.string().optional(),
  reward_token_address: Joi.string().optional(),
});

module.exports = schema;