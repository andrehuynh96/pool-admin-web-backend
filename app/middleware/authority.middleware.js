const Permission = require('app/model/staking').permissions;
const RolePermission = require('app/model/staking').role_permissions;
const PermissionKey = require('app/model/staking/value-object/permission-key');
module.exports = function (permission) {
  return async function (req, res, next) {
    if (!req.session || !req.session.authenticated || !req.session.role) {
      res.forbidden();
    } else {
      if (!PermissionKey[permission.KEY]) {
        res.badRequest(res.__("PERMISSION_NOT_FOUND"), "PERMISSION_NOT_FOUND");
      } else {
        if (!req.roles.includes(permission.KEY)) {
          res.forbidden();
        } else {
          next()
        }
      }
    }
  }
}
