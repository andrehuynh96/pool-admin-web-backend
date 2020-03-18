const Joi = require('joi');
const timeUnit = require("app/model/staking/value-object/time-unit")

let times = Object.keys(timeUnit);

const schema = Joi.object().keys({
    name: Joi.string().required(),
    duration: Joi.number().optional(),
    duration_type: Joi.string().valid(times).optional(),
    reward_percentage: Joi.number().min(0.00).max(1.00).optional(),
    status: Joi.number().optional()
});

module.exports = schema;