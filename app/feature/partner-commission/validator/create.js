const Joi = require('joi');

const schema = Joi.object().keys({
  items: Joi.array().required().items(
    Joi.object().keys({
      id: Joi.string().optional(),
      platform: Joi.string().required(),
      commission: Joi.number().required(),
      reward_address: Joi.string().required()
    })
  )
});

module.exports = schema;