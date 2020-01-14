const Joi = require('joi');

const schema = Joi.object().keys({
  email: Joi.string().required(),
  name: Joi.string().required(),
  parent_id: Joi.string().optional(),
  partner_type: Joi.string().optional(),
  actived_flg: Joi.boolean().optional()
});

module.exports = schema;