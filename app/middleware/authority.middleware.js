const PermissionKey = require('app/model/staking/value-object/permission-key');

module.exports = function (permission) {
  return async function (req, res, next) {
    if (!req.session || !req.session.authenticated || !req.session.permissions) {
      res.forbidden();
    } else {
      let exactPermission = permission.KEY;
      if (!PermissionKey[exactPermission]) {
        res.badRequest(res.__("PERMISSION_NOT_FOUND"), "PERMISSION_NOT_FOUND");
      } else {
        if (!req.session.permissions.includes(exactPermission)) {
          res.forbidden();
        } else {
          next()
        }
      }
    }
  }
} 