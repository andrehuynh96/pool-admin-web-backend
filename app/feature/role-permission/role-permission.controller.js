const logger = require("app/lib/logger");
const userRole = require("app/model/staking").user_roles;
const RolePermission = require("app/model/staking").role_permissions
const database = require('app/lib/database').db().staking;
const Permission = require("app/model/staking").permissions;
const Role = require("app/model/staking").roles;
module.exports = {
    getAll: async (req, res, next) => {
        try {
            let limit = req.query.limit ? parseInt(req.query.limit) : 10;
            let offset = req.query.offset ? parseInt(req.query.offset) : 0;
            const { count: total, rows: items } = await Permission.findAndCountAll({ limit, offset, order: [['created_at', 'ASC']] });
            return res.ok({
                items: items,
                offset: offset,
                limit: limit,
                total: total
            });
        }
        catch (err) {
            logger.error("get list permission fail:", err);
            next(err);
        }
    },
    get: async (req, res, next) => {
        try {
            let limit = req.query.limit ? parseInt(req.query.limit) : 10;
            let offset = req.query.offset ? parseInt(req.query.offset) : 0;
            let user = req.session.user
            let roles = await userRole.findAll({
                attributes: ['role_id'],
                where: {
                    user_id: user.id
                }
            })
            let roleList = roles.map(role => role.role_id);
            let rolePermissions = await RolePermission.findAll({
                attributes: [
                    "permission_id"
                ],
                where: {
                    role_id: roleList
                }
            });
            rolePermissions = [...new Set(rolePermissions.map(ele => ele.permission_id))];
            let where = {
                id: rolePermissions
            }
            const { count: total, rows: items } = await Permission.findAndCountAll({ limit, offset, where: where, order: [['created_at', 'ASC']] });
            return res.ok({
                items: items,
                offset: offset,
                limit: limit,
                total: total
            });
        }
        catch (err) {
            logger.error("get list permission of role fail:", err);
            next(err);
        }
    },
    create: async (req, res, next) => {
        const transaction = await database.transaction();
        try {
            let name = req.body.name
            let level = req.body.level
            let permissionList = req.body.permission_id

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
            logger.info('role-permission::create::role-permission::');
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
            let permissionList = req.body.permission_id

            let role = await Role.findOne({
                where: {
                    id: req.params.id
                }
            })
            if (!role) {
                return res.badRequest(res.__("ROLE_NOT_FOUND"), "ROLE_NOT_FOUND", { fields: ['id'] });
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

            logger.info('role-permission::update::role-permission::');
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