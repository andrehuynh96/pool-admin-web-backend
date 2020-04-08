const Joi = require('joi');
const timeUnit = require("app/model/staking/value-object/time-unit");
const StakingType = require("app/model/staking/value-object/staking-type");
const PlatformSymbol = require("app/model/staking/value-object/platform").map(ele => ele.symbol);

let times = Object.keys(timeUnit);
let addressRegex = /^0x[a-fA-F0-9]{40}$/g;

const schema = Joi.object().keys({
  name: Joi.string().required(),
  platform: Joi.string().valid(PlatformSymbol).optional(),
  symbol: Joi.string().required(),
  sc_token_address: Joi.string().optional().allow(""),
  icon: Joi.any().required(),
  erc20_validator_fee: Joi.number().optional().allow(""),
  erc20_reward_estimate: Joi.string().optional().allow(""),
  erc20_duration: Joi.string().optional().allow(""),
  status: Joi.number().valid([-2, -1, 0, 1]).required(),
  max_payout: Joi.number().required()
});

module.exports = schema;