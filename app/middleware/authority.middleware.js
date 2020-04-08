const Permission = require('app/model/staking').permissions;
const RolePermission = require('app/model/staking').role_permissions;
module.exports = function (permission) {
  return async function (req, res, next) {
    if (!req.session || !req.session.authenticated || !req.session.role) {
      res.forbidden();
    } else {
      let action = await Permission.findOne({
        where: {
          name: permission
        }
      })
      if (!action) {
        res.badRequest(res.__("PERMISSION_NOT_FOUND"), "PERMISSION_NOT_FOUND");
      }else {
        let result = await RolePermission.findOne({
          where: {
            permission_id: action.id,
            role_id: req.session.role
          }
        })
        if (!result) {
          res.forbidden();
        } else {
          next()
        }
      }
    }
  }
}
