const Joi = require('joi');

const schema = Joi.object().keys({
    staking_plan_code: Joi.string().optional(),
    duration: Joi.number().optional(),
    duration_type: Joi.string().optional(),
    reward_per_year: Joi.number().optional(),
    actived_flg: Joi.boolean().optional(),
    reward_in_diff_platform_flg: Joi.boolean().optional(),
    reward_platform: Joi.string().optional(),
    reward_token_address: Joi.string().optional(),
});

module.exports = schema;