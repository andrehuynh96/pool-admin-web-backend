const Joi = require('joi');

const schema = Joi.object().keys({
  items: Joi.array().required().items(
    Joi.object().keys({
      id: Joi.number().required(),
      cycle: Joi.number().optional(),
      min_amount: Joi.number().optional()
    })
  )
});

module.exports = schema;