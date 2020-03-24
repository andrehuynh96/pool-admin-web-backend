const Joi = require('joi');
const timeUnit = require("app/model/staking/value-object/time-unit");
const StakingType = require("app/model/staking/value-object/staking-type");
const PlatformSymbol = require("app/model/staking/value-object/platform").map(ele => ele.symbol);

let times = Object.keys(timeUnit);

const schema = Joi.object().keys({
  name: Joi.string().required(),
  symbol: Joi.string().required(),
  icon: Joi.any().optional(),
  erc20_validator_fee: Joi.number().optional().allow(""),
  erc20_reward_estimate: Joi.string().optional().allow(""),
  erc20_duration: Joi.string().optional().allow(""),
  status: Joi.number().valid([-2, -1, 0, 1]).optional()
});


module.exports = schema;