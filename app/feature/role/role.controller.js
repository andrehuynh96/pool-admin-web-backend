const logger = require('app/lib/logger');
const Role = require("app/model/staking").roles;
const database = require('app/lib/database').db().staking;
const Permission = require("app/model/staking").permissions;
const RolePermission = require("app/model/staking").role_permissions
module.exports = {
  getAll: async (req, res, next) => {
    try {
      let result = await Role.findAll({
        where: {
          deleted_flg: false
        }
      });
      return res.ok(result);
    }
    catch (err) {
      logger.error('getAll role fail:', err);
      next(err);
    }
  },
  create: async (req, res, next) => {
    const transaction = await database.transaction();
    try {
      let name = req.body.name
      let level = req.body.level
      let permissionList = req.body.permission_ids
      let items = await Permission.findAll({
        attributes:
          ["id"]
      });
      let allPermissions = items.map(ele => ele.id)

      const foundPermission = permissionList.every(ele => allPermissions.includes(ele))
      if(!foundPermission){
        return res.badRequest(res.__("PERMISION_IDS_NOT_FOUND"), "PERMISION_IDS_NOT_FOUND", { fields: ['permission_ids'] });
      }
      let role = await Role.findOne({
        where: {
          name: name
        }
      })
      if (role) {
        return res.badRequest(res.__("ROLE_EXIST_ALREADY"), "ROLE_EXIST_ALREADY", { fields: ['name'] });
      }
      let createRoleResponse = await Role.create({
        name: name,
        level: level,
        deleted_flg: false,
        root_flg: false
      }, { transaction })
      if (!createRoleResponse) {
        if (transaction) await transaction.rollback();
        return res.serverInternalError();
      }
      let data = []
      permissionList.map(ele => {
        data.push({
          role_id: createRoleResponse.id,
          permission_id: ele
        })
      })

      let rolePermissions = await RolePermission.bulkCreate(data, {
        returning: true
      }, { transaction });
      if (!rolePermissions) {
        if (transaction) await transaction.rollback();
        return res.serverInternalError();
      }
      logger.info('role::create::role');
      await transaction.commit();
      return res.ok({ role_permissions: data });
    }
    catch (err) {
      logger.error("create new role fail:", err);
      if (transaction) await transaction.rollback();
      next(err);
    }
  },
  update: async (req, res, next) => {
    const transaction = await database.transaction();
    try {
      let name = req.body.name
      let level = req.body.level
      let permissionList = req.body.permission_ids
      let role = await Role.findOne({
        where: {
          id: req.params.id
        }
      })
      if (!role) {
        return res.badRequest(res.__("ROLE_NOT_FOUND"), "ROLE_NOT_FOUND", { fields: ['id'] });
      }
      if(roles.root_flg){
        return res.badRequest(res.__("UNABLE_UPDATE_ROOT_ROLE"), "UNABLE_UPDATE_ROOT_ROLE", { fields: ['id'] });
      }
      let items = await Permission.findAll({
        attributes:
          ["id"]
      });
      let allPermissions = items.map(ele => ele.id)

      const foundPermission = permissionList.every(ele => allPermissions.includes(ele))
      if(!foundPermission){
        return res.badRequest(res.__("PERMISION_IDS_NOT_FOUND"), "PERMISION_IDS_NOT_FOUND", { fields: ['permission_ids'] });
      }
      if (name !== role.name || level !== role.level) {
        let updateRoleResponse = await Role.update({
          name: name,
          level: level
        }, {
          where: {
            id: req.params.id
          },
          returning: true
        }, { transaction });
        if (!updateRoleResponse) {
          if (transaction) await transaction.rollback();
          return res.serverInternalError();
        }
      }
      await RolePermission.destroy({
        where: { role_id: req.params.id }
      }, { transaction });

      let data = []
      permissionList.map(ele => {
        data.push({
          role_id: req.params.id,
          permission_id: ele
        })
      })

      let rolePermissions = await RolePermission.bulkCreate(data, {
        returning: true
      }, { transaction });
      if (!rolePermissions) {
        if (transaction) await transaction.rollback();
        return res.serverInternalError();
      }

      logger.info('role::update::role');
      await transaction.commit();
      return res.ok(true);
    }
    catch (err) {
      logger.error("update new role fail:", err);
      if (transaction) await transaction.rollback();
      next(err);
    }
  }
}