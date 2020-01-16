const Joi = require('joi');
const UserStatus = require("app/model/staking/value-object/user-status");
const status = Object.keys(UserStatus);

const schema = Joi.object().keys({
  user_sts: Joi.string().valid(status).required(),
  role_id: Joi.number().required()
});

module.exports = schema;