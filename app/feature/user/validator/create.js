const Joi = require('joi');

const schema = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  name: Joi.string().optional(),
  role_id: Joi.number().required()
});

module.exports = schema;