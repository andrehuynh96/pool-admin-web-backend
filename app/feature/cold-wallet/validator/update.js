const Joi = require('joi');

const schema = Joi.object().keys({
  items: Joi.array().required().items(
    Joi.object().keys({
      id: Joi.string().required(),
      percenctage: Joi.number().min(0.000).max(100).optional(),
      reward_address: Joi.string().optional(),
      min_amount: Joi.number().optional(),
      enable_flg: Joi.boolean().optional()
    })
  )
});

module.exports = schema;