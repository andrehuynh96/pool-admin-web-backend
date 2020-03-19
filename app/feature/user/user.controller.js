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

module.exports = {
  search: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let roles = req.session.role;
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
            role_id: { [Op.gte]: Math.min(...roles) }
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
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
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
    try {
      if (req.params.id == req.user.id) {
        return res.badRequest(res.__("USER_NOT_DELETED"), "USER_NOT_DELETED");
      }
      let result = await User.findOne({
        where: {
          id: req.params.id
        }
      })

      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }

      let [_, response] = await User.update({
        deleted_flg: true,
        updated_by: req.user.id
      }, {
          where: {
            id: req.params.id
          },
          returning: true
        });
      if (!response || response.length == 0) {
        return res.serverInternalError();
      }
      _sendEmailDeleteUser(result,verifyToken);
      return res.ok(true);
    }
    catch (err) {
      logger.error('delete user fail:', err);
      next(err);
    }
  },
  create: async (req, res, next) => {
    const transaction = await database.transaction();
    try {
      let result = await User.findOne({
        where: {
          email: req.body.email.toLowerCase(),
          deleted_flg: false
        }
      })

      if (result) {
        return res.badRequest(res.__("EMAIL_EXISTS_ALREADY"), "EMAIL_EXISTS_ALREADY");
      }

      let role = await Role.findOne({
        where: {
          id: req.body.role_id
        }
      })

      if (!role) {
        return res.badRequest(res.__("ROLE_NOT_FOUND"), "ROLE_NOT_FOUND");
      }

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
        await transaction.rollback();
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
        await transaction.rollback();
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
      await transaction.commit();
      _sendEmailCreateUser(user, verifyToken);

      let response = userMapper(user);
      response.role_id = role.id
      return res.ok(response);
    }
    catch (err) {
      logger.error('create account fail:', err);
      await transaction.rollback();
      next(err);
    }
  },

  update: async (req, res, next) => {
    const transaction = await database.transaction();
    try {
      let result = await User.findOne({
        where: {
          id: req.params.id
        }
      })

      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }

      let role = await Role.findOne({
        where: {
          id: req.body.role_id
        }
      })

      if (!role) {
        return res.badRequest(res.__("ROLE_NOT_FOUND"), "ROLE_NOT_FOUND");
      }
      let data = {
        user_sts: req.body.user_sts,
        updated_by: req.user.id
      };
      if (req.body.name) {
        data.name = req.body.name;
      }
      let [_, response] = await User.update(data, {
          where: {
            id: req.params.id
          },
          returning: true
        }, { transaction });
      if (!response || response.length == 0) {
        await transaction.rollback();
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
        await transaction.rollback();
        return res.serverInternalError();
      }

      await transaction.commit();
      let user = userMapper(result);
      user.role_id = role.id
      return res.ok(user);
    }
    catch (err) {
      logger.error('update user fail:', err);
      await transaction.rollback();
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
        return res.badRequest(res.__("TOKEN_EXPIRED"), "TOKEN_EXPIRED");
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
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
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
      _sendEmailCreateUser(user, verifyToken);
      return res.ok(true);
    }
    catch (err) {
      logger.error('create account fail:', err);
      next(err);
    }
  }
}

async function _sendEmailCreateUser(user, otp) {
  try {
    let subject = `${config.emailTemplate.partnerName} - Create Account`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      link: `${config.linkWebsiteVerify}?token=${otp.code}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, user.email, data, config.emailTemplate.verifyEmail);
  } catch (err) {
    logger.error("send email create account fail", err);
  }
}

async function _sendEmailDeleteUser(user,verifyToken) {
  try {
    let subject = ` ${config.emailTemplate.partnerName} - Delete account`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      link: `${config.linkWebsiteVerify}?token=${verifyToken}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, user.email, data,config.emailTemplate.deactiveAccount );
  } catch (err) {
    logger.error("send email unsubcribe account fail", err);
  }
}