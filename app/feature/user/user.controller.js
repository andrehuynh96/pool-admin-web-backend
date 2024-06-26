const logger = require('app/lib/logger');
const User = require("app/model/staking").users;
const UserStatus = require("app/model/staking/value-object/user-status");
const userMapper = require("app/feature/response-schema/user.response-schema");
const bcrypt = require('bcrypt');
const config = require("app/config");
const uuidV4 = require('uuid/v4');
const OTP = require("app/model/staking").otps;
const OtpType = require("app/model/staking/value-object/otp-type");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const mailer = require('app/lib/mailer');
const database = require('app/lib/database').db().staking;
const Role = require("app/model/staking").roles;
const UserRole = require("app/model/staking").user_roles;
const { passwordEvaluator } = require('app/lib/utils');

module.exports = {
  search: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let rolesControl = await _getRoleControl(req.roles);
      let where = { deleted_flg: false };
      let include = [
        {
          model: UserRole,
          include: [
            {
              model: Role
            }
          ],
          where: {
            role_id: { [Op.in]: rolesControl }
          }
        }
      ];
      if (req.query.user_sts) {
        where.user_sts = req.query.user_sts
      }
      if (req.query.query) {
        where.email = { [Op.iLike]: `%${req.query.query}%` };
      }
      const { count: total, rows: items } = await User.findAndCountAll({ limit, offset, where: where, include: include, order: [['created_at', 'DESC']] });
      return res.ok({
        items: userMapper(items),
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error('search user fail:', err);
      next(err);
    }
  },
  get: async (req, res, next) => {
    try {
      let result = await User.findOne({
        where: {
          id: req.params.id
        }
      })

      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ['id'] });
      }

      let userRole = await UserRole.findOne({
        where: {
          user_id: req.params.id
        }
      })

      let response = userMapper(result);
      if (userRole) {
        response.role_id = userRole.role_id;
      }
      return res.ok(response);
    }
    catch (err) {
      logger.error('getMe fail:', err);
      next(err);
    }
  },
  delete: async (req, res, next) => {
    let transaction;
    try {
      if (req.params.id == req.user.id) {
        return res.badRequest(res.__("USER_NOT_DELETED"), "USER_NOT_DELETED", { fields: ['id'] });
      }
      let result = await User.findOne({
        where: {
          id: req.params.id,
          deleted_flg: false
        }
      })

      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ['id'] });
      }

      transaction = await database.transaction();
      await UserRole.destroy({
        where: {
          user_id: req.params.id
        }
      }, { transaction });
      let response = await User.destroy({
        where: {
          id: req.params.id
        },
        returning: true
      }, { transaction });
      await transaction.commit();

      if (!response || response.length == 0) {
        return res.serverInternalError();
      }
      _sendEmailDeleteUser(result);
      return res.ok(true);
    }
    catch (err) {
      logger.error('delete user fail:', err);
      if (transaction) await transaction.rollback();
      next(err);
    }
  },
  create: async (req, res, next) => {
    let transaction;
    try {
      let result = await User.findOne({
        where: {
          email: req.body.email.toLowerCase(),
          deleted_flg: false
        }
      })

      if (result) {
        return res.badRequest(res.__("EMAIL_EXISTS_ALREADY"), "EMAIL_EXISTS_ALREADY", { fields: ['email'] });
      }

      let role = await Role.findOne({
        where: {
          id: req.body.role_id
        }
      })

      if (!role) {
        return res.badRequest(res.__("ROLE_NOT_FOUND"), "ROLE_NOT_FOUND", { fields: ['role_id'] });
      }

      transaction = await database.transaction();

      let passWord = bcrypt.hashSync("Abc@123456", 10);
      let user = await User.create({
        email: req.body.email.toLowerCase(),
        name: req.body.name,
        password_hash: passWord,
        user_sts: UserStatus.UNACTIVATED,
        updated_by: req.user.id,
        created_by: req.user.id
      }, { transaction });

      if (!user) {
        if (transaction) await transaction.rollback();
        return res.serverInternalError();
      }
      user.roleName = role.name
      await UserRole.destroy({
        where: {
          user_id: user.id,
        }
      }, { transaction });

      let userRole = await UserRole.create({
        user_id: user.id,
        role_id: role.id
      }, { transaction });
      if (!userRole) {
        if (transaction) await transaction.rollback();
        return res.serverInternalError();
      }

      let verifyToken = Buffer.from(uuidV4()).toString('base64');
      let today = new Date();
      today.setHours(today.getHours() + config.expiredVefiryToken);
      await OTP.update({
        expired: true
      }, {
        where: {
          user_id: user.id,
          action_type: OtpType.CREATE_ACCOUNT
        },
        returning: true
      })

      await OTP.create({
        code: verifyToken,
        used: false,
        expired: false,
        expired_at: today,
        user_id: user.id,
        action_type: OtpType.CREATE_ACCOUNT
      })
      let admin = await User.findOne({
        where: {
          id: user.created_by
        }
      })
      user.adminName = admin? admin.name : 'Admin'  
      user.role = role.name
      await transaction.commit();
      _sendEmailCreateUser(user, verifyToken);

      let response = userMapper(user);
      response.role_id = role.id
      return res.ok(response);
    }
    catch (err) {
      logger.error('create account fail:', err);
      if (transaction) await transaction.rollback();
      next(err);
    }
  },

  update: async (req, res, next) => {
    let transaction;
    try {
      let result = await User.findOne({
        where: {
          id: req.params.id
        }
      })

      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ['id'] });
      }

      let role = await Role.findOne({
        where: {
          id: req.body.role_id
        }
      })

      if (!role) {
        return res.badRequest(res.__("ROLE_NOT_FOUND"), "ROLE_NOT_FOUND", { fields: ['role_id'] });
      }
      let data = {
        user_sts: req.body.user_sts,
        updated_by: req.user.id
      };
      if (req.body.name) {
        data.name = req.body.name;
      }

      transaction = await database.transaction();

      let [_, response] = await User.update(data, {
        where: {
          id: req.params.id
        },
        returning: true
      }, { transaction });
      if (!response || response.length == 0) {
        if (transaction) await transaction.rollback();
        return res.serverInternalError();
      }

      await UserRole.destroy({
        where: {
          user_id: result.id,
        }
      }, { transaction });

      let userRole = await UserRole.create({
        user_id: result.id,
        role_id: role.id
      }, { transaction });

      if (!userRole) {
        if (transaction) await transaction.rollback();
        return res.serverInternalError();
      }

      await transaction.commit();
      let user = userMapper(result);
      user.role_id = role.id
      return res.ok(user);
    }
    catch (err) {
      logger.error('update user fail:', err);
      if (transaction) await transaction.rollback();
      next(err);
    }
  },
  active: async (req, res, next) => {
    try {
      let otp = await OTP.findOne({
        where: {
          code: req.body.verify_token,
          action_type: OtpType.CREATE_ACCOUNT
        }
      });
      if (!otp) {
        return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID", { fields: ["verify_token"] });
      }

      let today = new Date();
      if (otp.expired_at < today || otp.expired || otp.used) {
        return res.badRequest(res.__("TOKEN_EXPIRED"), "TOKEN_EXPIRED", { fields: ['verify_token'] });
      }

      let user = await User.findOne({
        where: {
          id: otp.user_id
        }
      });
      if (!user) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }

      if (user.user_sts == UserStatus.LOCKED) {
        return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
      }

      if (!passwordEvaluator(req.body.password)) {
        return res.badRequest(res.__("WEAK_PASSWORD"), "WEAK_PASSWORD");
      }

      let passWord = bcrypt.hashSync(req.body.password, 10);
      let [_, response] = await User.update({
        password_hash: passWord,
        user_sts: UserStatus.ACTIVATED
      }, {
        where: {
          id: user.id
        },
        returning: true
      });
      if (!response || response.length == 0) {
        return res.serverInternalError();
      }

      await OTP.update({
        used: true
      }, {
        where: {
          user_id: user.id,
          code: req.body.verify_token,
          action_type: OtpType.CREATE_ACCOUNT
        },
        returning: true
      })

      return res.ok(true);
    }
    catch (err) {
      logger.error("set new password fail: ", err);
      next(err);
    }
  },
  resendEmailActive: async (req, res, next) => {
    try {
      let userId = req.params.id;
      let user = await User.findOne({
        where: {
          id: userId
        }
      })

      if (!user) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ['id'] });
      }

      if (user.user_sts == UserStatus.ACTIVATED) {
        return res.forbidden(res.__("ACCOUNT_ACTIVATED_ALREADY"), "ACCOUNT_ACTIVATED_ALREADY");
      }

      if (user.user_sts == UserStatus.LOCKED) {
        return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
      }


      let verifyToken = Buffer.from(uuidV4()).toString('base64');
      let today = new Date();
      today.setHours(today.getHours() + config.expiredVefiryToken);
      await OTP.update({
        expired: true
      }, {
        where: {
          user_id: user.id,
          action_type: OtpType.CREATE_ACCOUNT
        },
        returning: true
      })

      await OTP.create({
        code: verifyToken,
        used: false,
        expired: false,
        expired_at: today,
        user_id: user.id,
        action_type: OtpType.CREATE_ACCOUNT
      })
      let userRole = await UserRole.findOne({
        where: {
          user_id: user.id
        },
        order: [['id', 'DESC']]
      })
      let role = await Role.findOne({
        where: {
          id: userRole.role_id
        }
      })
      let admin = await User.findOne({
        where: {
          id: user.created_by
        }
      })
      user.adminName = admin? admin.name : 'Admin'  
      user.role = role.name
      _sendEmailCreateUser(user, verifyToken);
      return res.ok(true);
    }
    catch (err) {
      logger.error('create account fail:', err);
      next(err);
    }
  },
  resendVerifyEmail: async (req, res, next) => {
    try {
      let otp = await OTP.findOne({
        where: {
          code: req.body.verify_token
        }
      })
      if (!otp) {
        return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID", { fields: ['verify_token'] })
      }
      if (otp.action_type !== OtpType.CREATE_ACCOUNT) {
        return res.badRequest(res.__("TOKEN_IS_NOT_CREATE_ACCOUNT"), "TOKEN_IS_NOT_CREATE_ACCOUNT", { fields: ['verify_token'] })
      }
      let user = await User.findOne({
        where: {
          id: otp.user_id
        }
      })
      if (user.user_sts !== UserStatus.UNACTIVATED) {
        return res.badRequest(res.__("USER_IS_NOT_UNACTIVATED"), "USER_IS_NOT_UNACTIVATED")
      }

      let verifyToken = Buffer.from(uuidV4()).toString('base64');
      let today = new Date();
      today.setHours(today.getHours() + config.expiredVefiryToken);
      await OTP.update({
        expired: true
      }, {
        where: {
          user_id: user.id
        },
        returning: true
      });
      //TODO:
      let newOtp = await OTP.create({
        code: verifyToken,
        used: false,
        expired: false,
        expired_at: today,
        user_id: user.id,
        action_type: OtpType.CREATE_ACCOUNT
      });
      if (!newOtp) {
        return res.serverInternalError();
      }
      let userRole = await UserRole.findOne({
        where: {
          user_id: user.id
        },
        order: [['id', 'DESC']]
      })
      let role = await Role.findOne({
        where: {
          id: userRole.role_id
        }
      })
      let admin = await User.findOne({
        where: {
          id: user.created_by
        }
      })
      user.adminName = admin? admin.name : 'Admin'  
      user.role = role.name
      await _sendEmailCreateUser(user, newOtp.code);
      return res.ok(true);
    }
    catch (err) {
      logger.error('resend verify email fail:', err);
      next(err);
    }
  }
}

async function _sendEmailCreateUser(user, verifyToken) {
  try {
    let subject = `${config.emailTemplate.partnerName} - Create Account`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      role: user.role,
      name: user.adminName,
      link: `${config.website.urlActive}${verifyToken}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, user.email, data, config.emailTemplate.activeAccount);
  } catch (err) {
    logger.error("send email create account fail", err);
  }
}

async function _sendEmailDeleteUser(user) {
  try {
    let subject = `${config.emailTemplate.partnerName} - Delete Account`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, user.email, data, config.emailTemplate.deactiveAccount);
  } catch (err) {
    logger.error("send email delete account fail", err);
  }
}
async function _getRoleControl(roles) {
  let levels = roles.map(ele => ele.level)
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