const Permission = require("app/model/staking").permissions;
const Role = require("app/model/staking").roles;
const RolePermission = require("app/model/staking").role_permissions;
let PermissionKey = Object.assign({}, require("app/model/staking/value-object/permission-key"));

module.exports = async () => {
  let rolePermission = await RolePermission.findAll({});
  if (rolePermission.length == 0) {
    let permissions = await Permission.findAll({});
    let roles = await Role.findAll({});
    if (permissions.length > 0 && roles.length > 0) {
      permissions = Object.assign({}, ...permissions.map(ele => { return { [ele.name]: ele.id } }));
      roles = Object.assign({}, ...roles.map(ele => { return { [ele.name]: ele.id } }));
      await RolePermission.destroy({
        where: {}
      });
      let data = [];
      Object.keys(PermissionKey).forEach(key => {
        if (PermissionKey[key].ROLES.length > 0)
          PermissionKey[key].ROLES.map(ele => {
            data.push({
              role_id: roles[ele],
              permission_id: permissions[key]
            })
          });
      });
      await RolePermission.bulkCreate(data, {
        returning: true
      });
    }
  }
};