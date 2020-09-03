const joi = require("joi");

module.exports = function (schema) {
  return function (req, res, next) {
    const result = joi.validate(req.body, schema);
    if (result.error) {
      return res.badRequest(res.__('MISSING_PARAMETERS'), 'MISSING_PARAMETERS', {
        details: result.error.details,
      });
    }

    next();
  };
};
