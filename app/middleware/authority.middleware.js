const Roles = require('app/model/staking').roles;
const UserRole = require('app/model/staking').user_roles;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = function (permission) {
  return async function (req, res, next) {
    if (permission.KEY == 'CREATE_USER' || permission.KEY == 'UPDATE_USER' || permission.KEY == 'DELETE_USER') {
      let myLevel = req.session.roles.map(ele => ele.level)
      let nextLevel = []
      for (let ele of myLevel) {
        let roles = await Roles.findOne({
          attribute: ["level"],
          where: {
            level: { [Op.gt]: ele }
          },
          order: [['level', 'ASC']]
        })
        nextLevel.push(roles.level)
      }
      let roleActions = await Roles.findAll({
        attribute: ["id"],
        where: {
          level: nextLevel
        }
      })
      roleActions = roleActions.map(ele => ele.id)
      let roleId = 0
      if (req.body.role_id) {
        roleId = req.body.role_id
      }
      else {
        let userRole = await UserRole.findOne({
          where: {
            user_id: req.params.id
          }
        })
        roleId = userRole.role_id
      }
      if (!roleActions.includes(roleId)) {
        res.forbidden();
      }
      else {
        next();
      }
    }
    else if (!req.session || !req.session.authenticated || !req.session.roles || !req.session.permissions.includes(permission.KEY)) {
      res.forbidden();
    }
    else {
      next()
    }
  }
}