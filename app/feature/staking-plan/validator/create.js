const Joi = require('joi');

const schema = Joi.object().keys({
    name: Joi.string().required(),
    duration: Joi.number().optional(),
    duration_type: Joi.string().optional(),
    reward_percentage: Joi.number().optional(),
    status: Joi.number().optional()
});

module.exports = schema;