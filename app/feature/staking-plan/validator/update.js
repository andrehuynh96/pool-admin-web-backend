const Joi = require('joi');

const schema = Joi.object().keys({
    name: Joi.string().required(),
    status: Joi.number().optional()
});

module.exports = schema;