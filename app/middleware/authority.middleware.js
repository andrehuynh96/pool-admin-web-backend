const Roles = require('app/model/staking').roles;
const PermissionKey = require('app/model/staking/value-object/permission-key');
const UserRole = require("app/model/staking").user_roles; 
module.exports = function (permission) {
  return async function (req, res, next) {
    if (!req.session || !req.session.authenticated || !req.session.role) {
      res.forbidden();
    } else {
      let exactPermission = permission.KEY;
      if (permission.KEY == 'CREATE_USER' || permission.KEY == 'UPDATE_USER' || permission.KEY == 'DELETE_USER') {
        let role_id;
        if (permission.KEY == 'DELETE_USER') {
          let role = await UserRole.findOne({
            where: {
              user_id: req.params.id
            }
          })
          role_id = role.role_id;
        }
        else role_id = req.body.role_id;
        let roleName = await Roles.findOne({
          where: {
            id: role_id
          }
        })
        exactPermission = permission.KEY + '_' + roleName.name.replace(/ /g, '_').toUpperCase();
      }
      if (!PermissionKey[exactPermission]) {
        res.badRequest(res.__("PERMISSION_NOT_FOUND"), "PERMISSION_NOT_FOUND");
      } else {
        if (!req.roles.includes(exactPermission)) {
          res.forbidden();
        } else {
          next()
        }
      }
    }
  }
}