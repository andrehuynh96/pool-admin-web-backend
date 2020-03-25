const Joi = require('joi');
const timeUnit = require("app/model/staking/value-object/time-unit")
const stakingPlanStatus = require("app/model/staking/value-object/staking-plan-status")

let times = Object.keys(timeUnit);
let status = Object.values(stakingPlanStatus)
const schema = Joi.object().keys({
    name: Joi.string().required(),
    duration: Joi.number().optional(),
    duration_type: Joi.string().valid(times).optional(),
    reward_percentage: Joi.number().min(0.00).max(100).optional(),
    status: Joi.number().valid(status).optional()
});

module.exports = schema;