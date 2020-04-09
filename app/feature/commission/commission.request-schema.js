const Joi = require('joi');

const schema = Joi.object().keys({
  items: Joi.array().required().items(
    Joi.object().keys({
      id: Joi.number().required(),
      cycle: Joi.number().integer().min(1).max(9999999999).optional(),
      min_amount: Joi.number().optional().unsafe()
    })
  )
});

module.exports = schema;