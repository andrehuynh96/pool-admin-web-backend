const Joi = require('joi');

const schema = Joi.object().keys({
  email: Joi.string().optional(),
  name: Joi.string().optional(),
  parent_id: Joi.string().optional().allow(null),
  partner_type: Joi.string().optional(),
  actived_flg: Joi.boolean().optional()
});

module.exports = schema;