const Permission = require("app/model/staking").permissions;
const Role = require("app/model/staking").roles;
const RolePermission = require("app/model/staking").role_permissions;

(async () => {
  let permissions = await Permission.findAll({});
  let adminRole = await Role.findOne({
    where: {
      name: "Admin"
    }
  });
  let operatorRole = await Role.findOne({
    where: {
      name: "Operator"
    }
  });

  if (permissions.length > 0 && adminRole) {
    let data = permissions.map(x => {
      return {
        role_id: adminRole.id,
        permission_id: x.id
      }
    })
    await RolePermission.bulkCreate(
      data, {
        returning: true
      });

    data = permissions.map(x => {
      return {
        role_id: operatorRole.id,
        permission_id: x.id
      }
    })
    await RolePermission.bulkCreate(
      data, {
        returning: true
      });
  }
})();