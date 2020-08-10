const _ = require('lodash');
const Model = require("app/model/staking").permissions;
const PermissionKey = require("app/model/staking/value-object/permission-key");
const RolePermission = require("app/model/staking").role_permissions;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


module.exports = async () => {
  let models = [];
  let permissions = Object.keys(PermissionKey).map(key => {
    return PermissionKey[key].KEY;
  });
  const updateModelTasks = [];

  for (let key of Object.keys(PermissionKey)) {
    const value = PermissionKey[key];
    let { KEY: permissionKey, GROUP_NAME: groupName, DESCRIPTION: description } = value;

    let m = await Model.findOne({
      where: {
        name: permissionKey,
      }
    });

    if (!m) {
      let model = {
        name: permissionKey,
        description: description || _.capitalize(_.replace(permissionKey, /_/g, ' ')),
        group_name: groupName,
        deleted_flg: false,
        created_by: 0,
        updated_by: 0
      };
      models.push(model);
    } else {
      if (!m.group_name) {
        m.group_name = groupName;
      }

      if (!m.description || m.description === m.name) {
        m.description = _.capitalize(_.replace(permissionKey, /_/g, ' '));
      }

      updateModelTasks.push(m.save());
    }
  }

  await Promise.all(updateModelTasks);

  await Model.bulkCreate(
    models, {
    returning: true
  });

  let permissionObsolete = await Model.findAll({
    where: {
      name: {
        [Op.notIn]: permissions
      }
    },
    raw: true
  });

  if (permissionObsolete && permissionObsolete.length > 0) {
    let ids = permissionObsolete.map(i => i.id);
    await RolePermission.destroy({
      where: {
        permission_id: {
          [Op.in]: ids
        }
      }
    });

    await Model.destroy({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    });
  }
};