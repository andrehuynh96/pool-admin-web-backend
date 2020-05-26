const Role = require('app/model/staking').roles;
const UserRole = require('app/model/staking').user_roles;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = function (fId, isUser = false) {
  return async function (req, res, next) {
    if (!req.session.roles) {
      res.forbidden();
    } else {
      let roles = [];
      let rolesControl = await _getRoleControl(req);
      let objectid = eval(fId);
      if (isUser) {
        roles = await _getUserRole(objectid);
      }
      else {
        roles.push(objectid);
      }

      const found = rolesControl.some(r => roles.includes(r));
      if (found) {
        next();
      }
      else {
        res.forbidden();
      }
    }
  }
}

async function _getRoleControl(req) {
  let levels = req.session.roles.map(ele => ele.level)
  let roleControl = []
  for (let e of levels) {
    let role = await Role.findOne({
      where: {
        level: { [Op.gt]: e },
        deleted_flg: false
      },
      order: [['level', 'ASC']]
    });

    if (role) {
      let roles = await Role.findAll({
        where: {
          level: role.level,
          deleted_flg: false
        }
      });
      roleControl = roleControl.concat(roles.map(x => x.id));
    }
  }

  return roleControl;
}

async function _getUserRole(userId) {
  let userRoles = await UserRole.findAll({
    attribute: ["role_id"],
    where: {
      user_id: userId
    }
  });

  return userRoles.map(x => x.role_id);
}