const Joi = require('joi');
const stakingPlanStatus = require("app/model/staking/value-object/staking-plan-status")

let status = Object.values(stakingPlanStatus)
const schema = Joi.object().keys({
    name: Joi.string().required(),
    status: Joi.number().valid(status).optional()
});

module.exports = schema;