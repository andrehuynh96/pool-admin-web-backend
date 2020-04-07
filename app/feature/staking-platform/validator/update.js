const Joi = require('joi');
const timeUnit = require("app/model/staking/value-object/time-unit");
const StakingType = require("app/model/staking/value-object/staking-type");

let times = Object.keys(timeUnit);

const schema = Joi.object().keys({
  name: Joi.string().required(),
  symbol: Joi.string().required(),
  icon: Joi.any().optional().allow(null),
  description: Joi.string().optional().allow(""),
  order_index: Joi.number().optional(),
  estimate_earn_per_year: Joi.number().min(0).max(100).optional(),
  lockup_unvote: Joi.number().optional(),
  lockup_unvote_unit: Joi.string().optional().allow("").valid(times),
  payout_reward: Joi.number().optional(),
  payout_reward_unit: Joi.string().optional().allow("").valid(times),
  status: Joi.number().valid([-2, -1, 0, 1]),
  confirmation_block: Joi.number().optional(),
  staking_type: Joi.string().required().valid(StakingType.NATIVE),
  validator_address: Joi.string().optional().allow(""),
  sc_lookup_addr: Joi.string().optional().allow(""),
  sc_token_address: Joi.string().optional().allow(""),
});

module.exports = schema;