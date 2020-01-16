const Joi = require('joi');
const timeUnit = require("app/model/staking/value-object/time-unit");
const StakingType = require("app/model/staking/value-object/staking-type");

let times = Object.keys(timeUnit);
let types = Object.keys(StakingType);

const schema = Joi.object().keys({
  name: Joi.string().required(),
  symbol: Joi.string().required(),
  icon: Joi.any().optional().allow(null),
  description: Joi.string().optional().allow(""),
  order_index: Joi.number().optional(),
  estimate_earn_per_year: Joi.number().optional(),
  lockup_unvote: Joi.number().optional(),
  lockup_unvote_unit: Joi.string().optional().allow("").valid(times),
  payout_reward: Joi.number().optional(),
  payout_reward_unit: Joi.string().optional().allow("").valid(times),
  actived_flg: Joi.boolean().optional(),
  confirmation_block: Joi.number().optional(),
  staking_type: Joi.string().required().valid(types),
  validator_address: Joi.string().optional().allow(""),
  sc_lookup_addr: Joi.string().optional().allow(""),
  sc_token_address: Joi.string().optional().allow(""),
});

module.exports = schema;